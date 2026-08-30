'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Event, HostingApplication } from '@upshot/types';
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

type Tab = 'events' | 'proposals';
type EventFilter = 'pending' | 'approved' | 'rejected' | 'all';

const EVENT_FILTERS: { key: EventFilter; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

export default function EventsPage() {
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>('events');
  const [filter, setFilter] = useState<EventFilter>('pending');
  const [events, setEvents] = useState<Event[]>([]);
  const [proposals, setProposals] = useState<HostingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [eventsRes, proposalsRes] = await Promise.all([
      api().events.getAllEventsAdmin(),
      api().hosting.getAllApplicationsAdmin(),
    ]);
    if (eventsRes.data) setEvents(eventsRes.data);
    if (eventsRes.error) setError(eventsRes.error.message);
    if (proposalsRes.data) setProposals(proposalsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(
    () => ({
      pending: events.filter((e) => e.status === 'pending').length,
      approved: events.filter((e) => e.status === 'approved').length,
      rejected: events.filter((e) => e.status === 'rejected').length,
      all: events.length,
    }),
    [events],
  );

  const visible = events.filter((e) => filter === 'all' || e.status === filter);
  const pendingProposals = proposals.filter((p) => p.status === 'pending');

  async function decideEvent(id: string, status: 'approved' | 'rejected') {
    if (!user) return;
    setBusyId(id + status);
    try {
      const res = await api().events.updateEventStatus(id, user.id, {
        status,
        ...(status === 'rejected' ? { rejection_reason: 'Rejected by admin' } : {}),
      });
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  async function decideProposal(id: string, approve: boolean) {
    if (!user) return;
    setBusyId(id + String(approve));
    try {
      const res = approve
        ? await api().hosting.approveApplication(id, user.id)
        : await api().hosting.rejectApplication(id, user.id, 'Rejected by admin');
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner label="Loading events…" />;

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Approve what goes live, and review the proposals hosts send in."
      />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <FilterPills
        options={[
          { key: 'events' as Tab, label: 'Events' },
          { key: 'proposals' as Tab, label: 'Host proposals' },
        ]}
        value={tab}
        onChange={setTab}
        counts={{ events: events.length, proposals: pendingProposals.length }}
      />

      {tab === 'events' ? (
        <>
          <FilterPills options={EVENT_FILTERS} value={filter} onChange={setFilter} counts={counts} />

          {visible.length === 0 ? (
            <EmptyState
              title="Nothing here"
              subtitle="Try another filter — events land in Pending when a host proposes one."
            />
          ) : (
            <Table head={['Event', 'Date', 'Going', 'Status', '']}>
              {visible.map((e) => {
                const going = (e as unknown as { application_count?: number }).application_count ?? 0;
                return (
                  <Row key={e.id}>
                    <Cell>
                      <Link href={`/events/${e.id}`} className="font-semibold hover:underline">
                        {e.title}
                      </Link>
                      <p className="text-xs text-muted">{e.location}</p>
                    </Cell>
                    <Cell className="whitespace-nowrap text-muted">{formatDate(e.event_date)}</Cell>
                    <Cell className="text-muted">
                      {going}
                      {e.max_attendees ? ` / ${e.max_attendees}` : ''}
                    </Cell>
                    <Cell>
                      <StatusBadge status={e.status} />
                    </Cell>
                    <Cell className="text-right">
                      {e.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            loading={busyId === e.id + 'approved'}
                            onClick={() => void decideEvent(e.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            loading={busyId === e.id + 'rejected'}
                            onClick={() => void decideEvent(e.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Link href={`/events/${e.id}`} className="text-sm font-semibold underline">
                          Open
                        </Link>
                      )}
                    </Cell>
                  </Row>
                );
              })}
            </Table>
          )}
        </>
      ) : proposals.length === 0 ? (
        <EmptyState title="No proposals" subtitle="Host applications from the app arrive here." />
      ) : (
        <Table head={['Proposal', 'Host', 'Date', 'Status', '']}>
          {proposals.map((p) => (
            <Row key={p.id}>
              <Cell>
                <Link href={`/events/proposals/${p.id}`} className="font-semibold hover:underline">
                  {p.title}
                </Link>
              </Cell>
              <Cell className="text-muted">{p.applicant_name}</Cell>
              <Cell className="whitespace-nowrap text-muted">{formatDate(p.event_date)}</Cell>
              <Cell>
                <StatusBadge status={p.status} />
              </Cell>
              <Cell className="text-right">
                {p.status === 'pending' ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      loading={busyId === p.id + 'true'}
                      onClick={() => void decideProposal(p.id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      loading={busyId === p.id + 'false'}
                      onClick={() => void decideProposal(p.id, false)}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Link href={`/events/proposals/${p.id}`} className="text-sm font-semibold underline">
                    Open
                  </Link>
                )}
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
}
