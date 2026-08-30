'use client';

import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import { Avatar, Button, Card, ErrorNote, Field, Input, PageHeader } from '@/components/ui';

export default function SettingsPage() {
  const { user, refresh, signOut } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setSaved(false);
    try {
      const res = await api().auth.updateProfile(user.id, {
        full_name: fullName.trim(),
        phone: phone.trim() || null,
      });
      if (res.error) setError(res.error.message);
      else {
        setSaved(true);
        await refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Your admin account." />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <Avatar name={user.full_name} size={48} />
            <div>
              <p className="font-bold text-ink">{user.full_name || 'Admin'}</p>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Full name">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </Field>
            <Field label="Phone" hint="Optional.">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <div className="flex items-center gap-3">
              <Button type="submit" variant="primary" loading={busy} disabled={!fullName.trim()}>
                Save
              </Button>
              {saved && <span className="text-sm font-semibold text-ok">Saved</span>}
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="mb-3 font-bold text-ink">Account</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Role</dt>
              <dd className="font-semibold">Admin</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Member since</dt>
              <dd>{formatDate(user.created_at)}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-line pt-4">
            <Button variant="danger" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
