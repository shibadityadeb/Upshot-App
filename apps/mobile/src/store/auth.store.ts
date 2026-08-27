import { create } from 'zustand';
import * as WebBrowser from 'expo-web-browser';
import { createApiClient } from '@upshot/api-client';
import type { User, RegisterStudentPayload, RegisterHostPayload } from '@upshot/types';
import { getOAuthRedirectUrl } from '../utils/authRedirect';

const api = createApiClient();

// Module-level subscription ref for proper cleanup
let authSubscription: { unsubscribe: () => void } | null = null;

// Guards against a second consent window being opened while one is already up —
// `isLoading` alone is not enough, since it is shared with the email/password flow.
let googleSignInInFlight = false;

interface AuthState {
  user: User | null;
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      const sessionResult = await api.auth.getSession();
      if (sessionResult.data) {
        const userResult = await api.auth.getCurrentUser();
        if (userResult.data) {
          set({ user: userResult.data.user });
        }
      }
    } catch {
      // Silently fail — user stays null
    } finally {
      set({ isInitialized: true });
    }

    // Unsubscribe previous listener before creating a new one
    if (authSubscription) {
      authSubscription.unsubscribe();
      authSubscription = null;
    }

    const { data: { subscription } } = api.supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        set({ user: null });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const result = await api.auth.getCurrentUser();
        if (result.data) {
          set({ user: result.data.user });
        }
      }
    });
    authSubscription = subscription;
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await api.auth.signIn(email, password);
      if (result.error) {
        set({ isLoading: false, error: result.error.message });
        return false;
      }
      set({ user: result.data?.user ?? null, isLoading: false });
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

      set({ user: sessionResult.data?.user ?? null, isLoading: false });
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
    set({ user: null, isLoading: false });
  },

  registerStudent: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await api.auth.registerStudent(payload);
      if (result.error) {
        set({ isLoading: false, error: result.error.message });
        return false;
      }
      set({ user: result.data?.user ?? null, isLoading: false });
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
      set({ user: result.data?.user ?? null, isLoading: false });
      return true;
    } catch (e: any) {
      set({ isLoading: false, error: e?.message ?? 'Host registration failed' });
      return false;
    }
  },

  refreshUser: async () => {
    const result = await api.auth.getCurrentUser();
    if (result.data) {
      set({ user: result.data.user });
    }
  },

  clearError: () => set({ error: null }),
}));
