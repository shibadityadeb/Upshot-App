'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button, ErrorNote, Field, Input } from '@/components/ui';

export default function LoginPage() {
  const { signIn, status, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === 'signed-in') router.replace('/dashboard');
  }, [status, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
    } finally {
      setBusy(false);
    }
  }

  return (
    // Lime is an accent here, not a wash: a full screen of it is hard to sit in
    // front of. The soft canvas matches the portal behind the login.
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-line bg-surface px-7 py-4 shadow-card">
            <span className="text-xl font-black tracking-tight text-ink">UPSHOT</span>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Admin
            </span>
          </span>
        </div>

        <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="h-1 bg-lime" />
          <div className="p-6">
            <h1 className="text-xl font-black text-ink">Sign in</h1>
            <p className="mb-5 mt-1 text-sm text-muted">Admin accounts only.</p>

            {error && <ErrorNote message={error} />}

            <form onSubmit={onSubmit} className="space-y-4">
              <Field label="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@upshot.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Button
                type="submit"
                variant="primary"
                loading={busy}
                disabled={!email.trim() || !password}
                className="w-full"
              >
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
