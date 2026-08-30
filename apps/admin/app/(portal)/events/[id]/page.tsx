'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Event, EventApplication } from '@upshot/types';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate, formatTime } from '@/lib/format';
import {
  Avatar,
  Button,
  Card,
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

/**
 * Applications approve themselves up to the event's capacity (migration 027),
 * so there is no queue to work here: people are coming, waiting for a seat, or
 * off the list. The waiting list promotes itself when a seat frees.
 */
type Bucket = 'going' | 'waiting' | 'removed';

const BUCKETS: { key: Bucket; label: string }[] = [
  { key: 'going', label: 'Going' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'removed', label: 'Removed' },
];

function bucketOf(status: string): Bucket {
  if (status === 'approved') return 'going';
  if (status === 'pending') return 'waiting';
  return 'removed';
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [apps, setApps] = useState<EventApplication[]>([]);
  const [bucket, setBucket] = useState<Bucket>('going');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const [eventRes, appsRes] = await Promise.all([
      api().events.getEventById(id),
      api().events.getEventApplications(id),
    ]);
    if (eventRes.data) setEvent(eventRes.data);
    else setError('Event not found');
    if (appsRes.data) setApps(appsRes.data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function decideEvent(status: 'approved' | 'rejected') {
    if (!user || !event) return;
    setBusyId('event' + status);
    try {
      const res = await api().events.updateEventStatus(event.id, user.id, {
        status,
        ...(status === 'rejected' ? { rejection_reason: 'Rejected by admin' } : {}),
      });
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  async function setAppStatus(appId: string, status: 'approved' | 'rejected') {
    if (!user) return;
    setBusyId(appId + status);
    try {
      // Approving a waitlisted person only works while a seat is free — the
      // capacity trigger refuses otherwise and the message lands here.
      const res = await api().events.updateApplicationStatus(appId, user.id, status);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  async function removeApp(appId: string, name: string) {
    if (!window.confirm(`Delete ${name}'s entry? They can sign up again afterwards.`)) return;
    setBusyId(appId + 'delete');
    try {
      const res = await api().events.removeApplication(appId);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner label="Loading event…" />;
  if (!event) return <EmptyState title="Event not found" />;

  const counts = {
    going: apps.filter((a) => bucketOf(a.status) === 'going').length,
    waiting: apps.filter((a) => bucketOf(a.status) === 'waiting').length,
    removed: apps.filter((a) => bucketOf(a.status) === 'removed').length,
  };
  const visible = apps.filter((a) => bucketOf(a.status) === bucket);
  const time = formatTime(event.event_time);

  return (
    <>
      <Link href="/events" className="mb-4 inline-block text-sm font-semibold text-muted hover:underline">
        ← Events
      </Link>

      <PageHeader
        title={event.title}
        subtitle={`${formatDate(event.event_date)}${time ? ` · ${time}` : ''} · ${event.location ?? ''}`}
        action={<StatusBadge status={event.status} />}
      />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      {event.status === 'pending' && (
        <Card className="mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-muted">This event is not live yet.</p>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              loading={busyId === 'eventapproved'}
              onClick={() => void decideEvent('approved')}
            >
              Approve event
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={busyId === 'eventrejected'}
              onClick={() => void decideEvent('rejected')}
            >
              Reject
            </Button>
          </div>
        </Card>
      )}

      <h2 className="mb-1 text-lg font-bold text-ink">Attendees</h2>
      <p className="mb-4 text-sm text-muted">
        {counts.going}
        {event.max_attendees ? ` of ${event.max_attendees}` : ''} coming
        {counts.waiting > 0 ? ` · ${counts.waiting} waiting` : ' · joins are automatic'}
      </p>

      <FilterPills options={BUCKETS} value={bucket} onChange={setBucket} counts={counts} />

      {visible.length === 0 ? (
        <EmptyState
          title={
            bucket === 'going'
              ? 'No one has signed up yet'
              : bucket === 'waiting'
                ? 'Nobody waiting'
                : 'Nobody removed'
          }
          subtitle={
            bucket === 'going'
              ? 'Anyone who applies joins straight away and shows up here.'
              : bucket === 'waiting'
                ? 'Once the event is full, later applicants wait here and move up on their own.'
                : 'People you reject, and anyone who withdraws, end up here.'
          }
        />
      ) : (
        <Table head={['Person', 'Contact', 'Joined', 'Note', '']}>
          {visible.map((app) => {
            const person = app.user;
            const name = person?.full_name ?? 'Unknown';
            const busy = busyId?.startsWith(app.id) ?? false;
            return (
              <Row key={app.id}>
                <Cell>
                  <div className="flex items-center gap-3">
                    <Avatar name={name} size={34} />
                    <span className="font-semibold">{name}</span>
                  </div>
                </Cell>
                <Cell className="text-muted">
                  <p>{person?.email ?? '—'}</p>
                  {person?.phone && <p className="text-xs">{person.phone}</p>}
                </Cell>
                <Cell className="whitespace-nowrap text-muted">{formatDate(app.applied_at)}</Cell>
                <Cell className="max-w-xs text-muted">{app.note || '—'}</Cell>
                <Cell className="text-right">
                  <div className="flex justify-end gap-2">
                    {bucket === 'going' && (
                      <Button
                        size="sm"
                        variant="danger"
                        loading={busyId === app.id + 'rejected'}
                        disabled={busy}
                        onClick={() => void setAppStatus(app.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    )}
                    {bucket === 'waiting' && (
                      <Button
                        size="sm"
                        variant="primary"
                        loading={busyId === app.id + 'approved'}
                        disabled={busy}
                        onClick={() => void setAppStatus(app.id, 'approved')}
                      >
                        Let in
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      loading={busyId === app.id + 'delete'}
                      disabled={busy}
                      onClick={() => void removeApp(app.id, name)}
                    >
                      Delete
                    </Button>
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
