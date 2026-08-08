import { create } from 'zustand';
import { createApiClient } from '@upshot/api-client';
import type { User, RegisterStudentPayload, RegisterHostPayload } from '@upshot/types';

const api = createApiClient();

// Module-level subscription ref for proper cleanup
let authSubscription: { unsubscribe: () => void } | null = null;

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
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
