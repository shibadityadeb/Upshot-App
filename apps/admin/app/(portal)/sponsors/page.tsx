'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SponsorInquiry, SponsorInquiryStatus } from '@upshot/types';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import {
  Button,
  Cell,
  EmptyState,
  ErrorNote,
  FilterPills,
  PageHeader,
  Row,
  Spinner,
  StatusBadge,
  Table,
} from '@/components/ui';

type Filter = 'all' | SponsorInquiryStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'pending', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'declined', label: 'Declined' },
  { key: 'all', label: 'All' },
];

const ACTIONS: { status: SponsorInquiryStatus; label: string; variant: 'primary' | 'secondary' | 'danger' }[] = [
  { status: 'contacted', label: 'Mark contacted', variant: 'secondary' },
  { status: 'accepted', label: 'Accept', variant: 'primary' },
  { status: 'declined', label: 'Decline', variant: 'danger' },
];

export default function SponsorsPage() {
  const { user } = useAuth();

  const [inquiries, setInquiries] = useState<SponsorInquiry[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api().sponsors.getAllInquiriesAdmin();
    if (res.error) setError(res.error.message);
    setInquiries(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: SponsorInquiryStatus) {
    if (!user) return;
    setBusyId(id + status);
    try {
      const res = await api().sponsors.updateInquiryStatus(id, user.id, status);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner label="Loading sponsors…" />;

  const counts = FILTERS.reduce(
    (acc, f) => {
      acc[f.key] = f.key === 'all' ? inquiries.length : inquiries.filter((i) => i.status === f.key).length;
      return acc;
    },
    {} as Record<Filter, number>,
  );
  const visible = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <>
      <PageHeader title="Sponsors" subtitle="Companies offering to sponsor an event or workshop." />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <FilterPills options={FILTERS} value={filter} onChange={setFilter} counts={counts} />

      {visible.length === 0 ? (
        <EmptyState
          title="No sponsor inquiries"
          subtitle="When someone taps Sponsor on a workshop in the app, it appears here."
        />
      ) : (
        <Table head={['Company', 'Contact', 'Event', 'Why sponsor', 'Sent', 'Status', '']}>
          {visible.map((s) => {
            const isOpen = expanded === s.id;
            return (
              <Row key={s.id}>
                <Cell>
                  <p className="font-semibold">{s.company_name}</p>
                  {s.website && (
                    <a
                      href={/^https?:\/\//.test(s.website) ? s.website : `https://${s.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-info underline"
                    >
                      {s.website}
                    </a>
                  )}
                </Cell>
                <Cell>
                  <p className="font-semibold">{s.contact_name}</p>
                  <a href={`mailto:${s.email}`} className="block text-xs text-info underline">
                    {s.email}
                  </a>
                  <a href={`tel:${s.phone}`} className="block text-xs text-info underline">
                    {s.phone}
                  </a>
                </Cell>
                <Cell>
                  <p className="font-semibold">{s.event?.title ?? '—'}</p>
                  {s.event?.event_date && (
                    <p className="text-xs text-muted">{formatDate(s.event.event_date)}</p>
                  )}
                </Cell>
                <Cell className="max-w-xs text-muted">
                  <p className={`whitespace-pre-wrap ${isOpen ? '' : 'line-clamp-2'}`}>{s.why_sponsor}</p>
                  {isOpen && s.message && (
                    <p className="mt-2 whitespace-pre-wrap">
                      <span className="font-semibold text-ink">Note: </span>
                      {s.message}
                    </p>
                  )}
                  <button
                    onClick={() => setExpanded(isOpen ? null : s.id)}
                    className="mt-1 text-xs font-semibold text-ink underline"
                  >
                    {isOpen ? 'Show less' : s.message ? 'Read more + note' : 'Read more'}
                  </button>
                </Cell>
                <Cell className="whitespace-nowrap text-muted">{formatDate(s.created_at)}</Cell>
                <Cell>
                  <StatusBadge status={s.status === 'pending' ? 'new' : s.status} />
                </Cell>
                <Cell className="text-right">
                  <div className="flex justify-end gap-2">
                    {ACTIONS.filter((a) => a.status !== s.status).map((a) => (
                      <Button
                        key={a.status}
                        size="sm"
                        variant={a.variant}
                        loading={busyId === s.id + a.status}
                        onClick={() => void setStatus(s.id, a.status)}
                      >
                        {a.label}
                      </Button>
                    ))}
                  </div>
                </Cell>
              </Row>
            );
          })}
        </Table>
      )}
    </>
  );
}
