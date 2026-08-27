import { create } from 'zustand';
import { AppState, type AppStateStatus } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { createApiClient, isSessionPersistenceEnabled } from '@upshot/api-client';
import type { User, RegisterStudentPayload, RegisterHostPayload } from '@upshot/types';
import { getOAuthRedirectUrl } from '../utils/authRedirect';

const api = createApiClient();

// Module-level refs so repeated initialize() calls never stack listeners.
let authSubscription: { unsubscribe: () => void } | null = null;
let appStateSubscription: { remove: () => void } | null = null;

/** Development-only auth tracing. Never logs tokens, passwords or user data. */
function authLog(message: string): void {
  if (__DEV__) console.log(`[AUTH] ${message}`);
}

/**
 * The single authoritative auth state.
 *
 * `loading` exists so nothing has to infer "signed out" from a null user while
 * the persisted session is still being read off disk — that inference is what
 * bounced people to the login screen mid-restore.
 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// Guards against a second consent window being opened while one is already up —
// `isLoading` alone is not enough, since it is shared with the email/password flow.
let googleSignInInFlight = false;

interface AuthState {
  user: User | null;
  status: AuthStatus;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  registerStudent: (payload: RegisterStudentPayload) => Promise<boolean>;
  registerHost: (payload: RegisterHostPayload) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'loading',
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    authLog('Initializing');
    // Surfaced explicitly: an in-memory fallback signs everyone out on restart
    // and is otherwise completely silent.
    authLog(
      isSessionPersistenceEnabled()
        ? 'Session storage: AsyncStorage (persistent)'
        : 'Session storage: IN-MEMORY — sessions will NOT survive a restart',
    );

    try {
      authLog('Restoring session');
      const sessionResult = await api.auth.getSession();

      if (sessionResult.data) {
        const userResult = await api.auth.getCurrentUser();
        if (userResult.data) {
          set({ user: userResult.data.user, status: 'authenticated' });
          authLog('Initial session: authenticated');
        } else {
          // A session exists but the profile lookup failed — most likely the
          // network. Staying 'authenticated' keeps the restored session; the
          // profile is re-fetched on the next auth event or refreshUser().
          set({ status: 'authenticated' });
          authLog('Initial session: authenticated (profile fetch deferred)');
        }
      } else {
        set({ user: null, status: 'unauthenticated' });
        authLog('Initial session: unauthenticated');
      }
    } catch (e) {
      // A restore failure is not a sign-out. Supabase keeps whatever it has on
      // disk, so treat this as "not signed in yet" without clearing storage.
      authLog(`Session restore error: ${e instanceof Error ? e.name : 'unknown'}`);
      set({ user: null, status: 'unauthenticated' });
    } finally {
      set({ isInitialized: true });
    }

    // Replace rather than add — initialize() may run again on a dev reload.
    if (authSubscription) {
      authSubscription.unsubscribe();
      authSubscription = null;
    }

    const { data: { subscription } } = api.supabase.auth.onAuthStateChange(
      async (event, session) => {
        authLog(event);

        switch (event) {
          case 'SIGNED_OUT':
            // The only path that clears the user. Supabase emits this for an
            // explicit sign-out or a refresh token it has definitively rejected.
            set({ user: null, status: 'unauthenticated' });
            return;

          case 'INITIAL_SESSION':
            // Already handled above by the explicit restore; acting again here
            // would race it. Recorded for tracing only.
            return;

          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED': {
            if (!session) return;
            const result = await api.auth.getCurrentUser();
            if (result.data) {
              set({ user: result.data.user, status: 'authenticated' });
            } else if (!get().user) {
              // Session is valid but the profile could not be read yet. Mark
              // authenticated so navigation proceeds; never downgrade to
              // unauthenticated on a failed profile fetch.
              set({ status: 'authenticated' });
            }
            return;
          }

          default:
            return;
        }
      },
    );
    authSubscription = subscription;

    // supabase-js cannot refresh reliably while the app is backgrounded, and
    // leaving the timer running there is what makes tokens go stale. Follow the
    // app's foreground state instead.
    if (appStateSubscription) {
      appStateSubscription.remove();
      appStateSubscription = null;
    }

    const handleAppState = (state: AppStateStatus) => {
      if (state === 'active') api.supabase.auth.startAutoRefresh();
      else api.supabase.auth.stopAutoRefresh();
    };

    appStateSubscription = AppState.addEventListener('change', handleAppState);
    handleAppState(AppState.currentState);
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await api.auth.signIn(email, password);
      if (result.error) {
        set({ isLoading: false, error: result.error.message });
        return false;
      }
      const signedIn = result.data?.user ?? null;
      set({ user: signedIn, isLoading: false, status: signedIn ? 'authenticated' : 'unauthenticated' });
      return true;
    } catch (e: any) {
      set({ isLoading: false, error: e?.message ?? 'Sign in failed' });
      return false;
    }
  },

  /**
   * Google sign-in via the system browser.
   *
   * Supabase performs the token exchange with Google server-side using the OAuth
   * client secret held in the Supabase project, so nothing secret ships in the
   * bundle and the profile is never taken on the client's word. The resulting
   * session is the same one email/password login produces, so everything
   * downstream (auth store, RLS, routing) behaves identically.
   */
  signInWithGoogle: async () => {
    if (googleSignInInFlight) return false;
    googleSignInInFlight = true;
    set({ isLoading: true, error: null });

    try {
      const redirectTo = getOAuthRedirectUrl();

      const urlResult = await api.auth.getOAuthUrl('google', redirectTo);
      if (urlResult.error || !urlResult.data) {
        set({ isLoading: false, error: urlResult.error?.message ?? 'Could not start Google sign-in.' });
        return false;
      }

      // Opens ASWebAuthenticationSession / Chrome Custom Tabs and resolves once the
      // redirect fires, so the callback URL never has to round-trip through routing.
      const result = await WebBrowser.openAuthSessionAsync(urlResult.data.url, redirectTo);

      if (result.type !== 'success' || !result.url) {
        // 'cancel'/'dismiss' covers both a user backing out and a provider that
        // is not configured (Supabase renders a JSON error rather than
        // redirecting). Ask which it was, so a setup problem is not silent.
        const configError = await api.auth.checkOAuthProviderError(urlResult.data.url);
        set({ isLoading: false, error: configError });
        return false;
      }

      const sessionResult = await api.auth.completeAuthFromUrl(result.url);
      if (sessionResult.error) {
        set({ isLoading: false, error: sessionResult.error.message });
        return false;
      }

      // Google must land in exactly the same authenticated state as
      // email/password — same session, same status, same routing downstream.
      const signedIn = sessionResult.data?.user ?? null;
      set({
        user: signedIn,
        isLoading: false,
        status: signedIn ? 'authenticated' : 'unauthenticated',
      });
      return true;
    } catch (e: any) {
      set({ isLoading: false, error: e?.message ?? 'Google sign-in failed. Please try again.' });
      return false;
    } finally {
      googleSignInInFlight = false;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await api.auth.signOut();
    set({ user: null, isLoading: false, status: 'unauthenticated' });
  },

  registerStudent: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await api.auth.registerStudent(payload);
      if (result.error) {
        set({ isLoading: false, error: result.error.message });
        return false;
      }
      const signedIn = result.data?.user ?? null;
      set({ user: signedIn, isLoading: false, status: signedIn ? 'authenticated' : 'unauthenticated' });
      return true;
    } catch (e: any) {
      set({ isLoading: false, error: e?.message ?? 'Registration failed' });
      return false;
    }
  },

  registerHost: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await api.auth.registerHost(payload);
      if (result.error) {
        set({ isLoading: false, error: result.error.message });
        return false;
      }
      const signedIn = result.data?.user ?? null;
      set({ user: signedIn, isLoading: false, status: signedIn ? 'authenticated' : 'unauthenticated' });
      return true;
    } catch (e: any) {
      set({ isLoading: false, error: e?.message ?? 'Host registration failed' });
      return false;
    }
  },

  refreshUser: async () => {
    const result = await api.auth.getCurrentUser();
    if (result.data) {
      set({ user: result.data.user, status: 'authenticated' });
    }
  },

  clearError: () => set({ error: null }),
}));
