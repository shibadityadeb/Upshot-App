'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Ambassador } from '@upshot/types';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  ErrorNote,
  Field,
  Input,
  PageHeader,
  Spinner,
} from '@/components/ui';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    const client = api();
    const [profileRes, ambassadorsRes, walletRes] = await Promise.all([
      client.supabase.from('profiles').select('*').eq('id', id).single(),
      client.ambassadors.getAllAmbassadors(),
      client.coins.getWalletBalance(id),
    ]);

    if (profileRes.error) setError(profileRes.error.message);
    else setProfile(profileRes.data as Profile);

    setAmbassador((ambassadorsRes.data ?? []).find((a) => a.user_id === id) ?? null);
    setBalance(walletRes.data?.current_balance ?? 0);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function makeAmbassador() {
    if (!id) return;
    setBusy('promote');
    try {
      const res = await api().ambassadors.createAmbassador(id);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusy(null);
    }
  }

  async function removeAmbassador() {
    if (!ambassador) return;
    setBusy('demote');
    try {
      const res = await api().ambassadors.deactivateAmbassador(ambassador.id);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusy(null);
    }
  }

  async function grantCoins() {
    if (!user || !id) return;
    const value = parseInt(amount, 10);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter a coin amount greater than zero.');
      return;
    }
    setBusy('coins');
    try {
      const res = await api().coins.addBonusCoins(
        user.id,
        id,
        value,
        note.trim() || 'Bonus from admin',
      );
      if (res.error) setError(res.error.message);
      else {
        setAmount('');
        setNote('');
        await load();
      }
    } finally {
      setBusy(null);
    }
  }

  if (loading) return <Spinner label="Loading profile…" />;
  if (!profile) return <EmptyState title="Person not found" />;

  return (
    <>
      <Link href="/people" className="mb-4 inline-block text-sm font-semibold text-muted hover:underline">
        ← People
      </Link>

      <div className="mb-6 flex items-center gap-4">
        <Avatar name={profile.full_name} size={56} />
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink">
            {profile.full_name || 'Unnamed'}
          </h1>
          <p className="text-sm text-muted">{profile.email}</p>
        </div>
      </div>

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 font-bold text-ink">Account</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Category</dt>
              <dd className="font-semibold">
                {profile.role === 'admin' ? 'Admin' : profile.role === 'company' ? 'Client' : 'Community Member'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Phone</dt>
              <dd>{profile.phone || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Member since</dt>
              <dd>{formatDate(profile.created_at)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Coin balance</dt>
              <dd className="font-semibold">{balance}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-5">
          <h2 className="mb-1 font-bold text-ink">Ambassador</h2>
          {ambassador ? (
            <>
              <p className="mb-3 text-sm text-muted">
                Referral code <span className="font-mono font-semibold text-ink">{ambassador.referral_code}</span>
                {' · '}
                {ambassador.tier} tier
              </p>
              <Button variant="danger" size="sm" loading={busy === 'demote'} onClick={() => void removeAmbassador()}>
                Remove ambassador status
              </Button>
            </>
          ) : (
            <>
              <p className="mb-3 text-sm text-muted">Not an ambassador. Promoting issues a referral code.</p>
              <Button variant="primary" size="sm" loading={busy === 'promote'} onClick={() => void makeAmbassador()}>
                Make ambassador
              </Button>
            </>
          )}
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-3 font-bold text-ink">Award coins</h2>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-28">
              <Field label="Amount">
                <Input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50"
                />
              </Field>
            </div>
            <div className="min-w-[220px] flex-1">
              <Field label="Reason">
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ran the Delhi meetup"
                />
              </Field>
            </div>
            <Button variant="primary" loading={busy === 'coins'} onClick={() => void grantCoins()}>
              Award
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
