'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@upshot/types';
import { api } from './api';

type Status = 'loading' | 'signed-out' | 'signed-in';

interface AuthValue {
  user: User | null;
  status: Status;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

/** Reason a non-admin is turned away — shown on the login screen. */
const NOT_ADMIN = 'That account is not an admin. Ask an existing admin to grant access.';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  /**
   * Reads the profile behind the current session and admits it only if the row
   * says admin. The portal is gated here rather than on the route alone, so a
   * demoted account loses access on its next load.
   */
  const resolveSession = useCallback(async () => {
    const client = api();
    const { data } = await client.supabase.auth.getSession();
    if (!data.session) {
      setUser(null);
      setStatus('signed-out');
      return;
    }

    const { data: profile } = await client.supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      await client.supabase.auth.signOut();
      setUser(null);
      setStatus('signed-out');
      setError(NOT_ADMIN);
      return;
    }

    setUser(profile as User);
    setStatus('signed-in');
    setError(null);
  }, []);

  useEffect(() => {
    void resolveSession();

    const { data: sub } = api().supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setStatus('signed-out');
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [resolveSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      const { error: signInError } = await api().supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      await resolveSession();
    },
    [resolveSession],
  );

  const signOut = useCallback(async () => {
    await api().supabase.auth.signOut();
    setUser(null);
    setStatus('signed-out');
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ user, status, error, signIn, signOut, refresh: resolveSession }),
    [user, status, error, signIn, signOut, resolveSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
