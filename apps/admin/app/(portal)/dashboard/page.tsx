'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Event } from '@upshot/types';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import {
  Cell,
  EmptyState,
  ErrorNote,
  PageHeader,
  Row,
  Spinner,
  StatCard,
  StatusBadge,
  Table,
} from '@/components/ui';

interface Stats {
  pendingApprovals: number;
  totalEvents: number;
  ambassadors: number;
  people: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    pendingApprovals: 0,
    totalEvents: 0,
    ambassadors: 0,
    people: 0,
  });
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const client = api();
    const today = new Date().toISOString().split('T')[0];

    // allSettled so one failing count cannot blank the whole dashboard.
    const results = await Promise.allSettled([
      client.supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      client.supabase
        .from('hosting_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      client.supabase.from('events').select('*', { count: 'exact', head: true }),
      client.supabase.from('ambassadors').select('*', { count: 'exact', head: true }),
      client.supabase.from('profiles').select('*', { count: 'exact', head: true }),
      client.supabase
        .from('events')
        .select('*, companies(name)')
        .gte('event_date', today)
        .in('status', ['approved', 'pending'])
        .order('event_date', { ascending: true })
        .limit(8),
    ]);

    const val = (i: number) =>
      results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<any>).value : null;

    setStats({
      pendingApprovals: (val(0)?.count ?? 0) + (val(1)?.count ?? 0),
      totalEvents: val(2)?.count ?? 0,
      ambassadors: val(3)?.count ?? 0,
      people: val(4)?.count ?? 0,
    });
    setUpcoming((val(5)?.data ?? []) as Event[]);

    if (results.every((r) => r.status === 'rejected')) {
      setError('Could not reach Supabase. Check the portal credentials in .env.local.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <Spinner label="Loading dashboard…" />;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="What needs you, and what is coming up." />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Awaiting approval" value={stats.pendingApprovals} tone="lime" />
        <StatCard label="Events" value={stats.totalEvents} />
        <StatCard label="Ambassadors" value={stats.ambassadors} />
        <StatCard label="People" value={stats.people} />
      </div>

      <h2 className="mb-3 text-lg font-bold text-ink">Upcoming events</h2>
      {upcoming.length === 0 ? (
        <EmptyState title="Nothing scheduled" subtitle="Approved and pending events appear here by date." />
      ) : (
        <Table head={['Event', 'Date', 'Status', '']}>
          {upcoming.map((e) => (
            <Row key={e.id}>
              <Cell className="font-semibold">{e.title}</Cell>
              <Cell className="text-muted">{formatDate(e.event_date)}</Cell>
              <Cell>
                <StatusBadge status={e.status} />
              </Cell>
              <Cell className="text-right">
                <Link href={`/events/${e.id}`} className="text-sm font-semibold underline">
                  Open
                </Link>
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
}
