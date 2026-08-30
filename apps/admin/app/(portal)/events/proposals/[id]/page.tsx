'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { HostingApplication } from '@upshot/types';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import {
  Button,
  Card,
  EmptyState,
  ErrorNote,
  PageHeader,
  Spinner,
  StatusBadge,
} from '@/components/ui';

function Detail({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="border-b border-line py-2.5 last:border-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-ink">{value === null || value === undefined || value === '' ? '—' : value}</p>
    </div>
  );
}

export default function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [app, setApp] = useState<HostingApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const { data, error: err } = await api()
      .supabase.from('hosting_applications')
      .select('*, user:profiles!user_id(id, full_name, email, avatar_url)')
      .eq('id', id)
      .single();
    if (err) setError(err.message);
    else setApp(data as HostingApplication);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function decide(approve: boolean) {
    if (!user || !app) return;
    setBusy(String(approve));
    try {
      const res = approve
        ? await api().hosting.approveApplication(app.id, user.id)
        : await api().hosting.rejectApplication(app.id, user.id, 'Rejected by admin');
      if (res.error) setError(res.error.message);
      else if (approve) router.push('/events');
      else await load();
    } finally {
      setBusy(null);
    }
  }

  if (loading) return <Spinner label="Loading proposal…" />;
  if (!app) return <EmptyState title="Proposal not found" />;

  return (
    <>
      <Link href="/events" className="mb-4 inline-block text-sm font-semibold text-muted hover:underline">
        ← Events
      </Link>

      <PageHeader
        title={app.title}
        subtitle="Approving this creates the live event and notifies the host."
        action={<StatusBadge status={app.status} />}
      />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-2 font-bold text-ink">The event</h2>
          <Detail label="Description" value={app.description} />
          <Detail label="Date" value={formatDate(app.event_date)} />
          <Detail label="Location" value={app.location} />
          <Detail
            label="City / state"
            value={[app.event_city, app.event_state].filter(Boolean).join(', ')}
          />
          <Detail label="Category" value={app.category} />
          <Detail label="Capacity" value={app.max_attendees} />
        </Card>

        <Card className="p-5">
          <h2 className="mb-2 font-bold text-ink">The host</h2>
          <Detail label="Name" value={app.applicant_name} />
          <Detail label="Email" value={app.applicant_email} />
          <Detail label="Phone" value={app.applicant_phone} />
          <Detail label="Submitted" value={formatDate(app.created_at)} />
          {app.status === 'rejected' && <Detail label="Reason" value={app.rejection_reason} />}
        </Card>
      </div>

      {app.status === 'pending' && (
        <div className="mt-6 flex gap-3">
          <Button variant="primary" loading={busy === 'true'} onClick={() => void decide(true)}>
            Approve and create event
          </Button>
          <Button variant="danger" loading={busy === 'false'} onClick={() => void decide(false)}>
            Reject
          </Button>
        </div>
      )}
    </>
  );
}
