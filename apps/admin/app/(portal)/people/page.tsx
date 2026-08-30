'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Avatar,
  Cell,
  EmptyState,
  ErrorNote,
  FilterPills,
  Input,
  PageHeader,
  Row,
  Spinner,
  Table,
} from '@/components/ui';

interface Person {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  /** Derived, not stored: who is an ambassador or a cartel student. */
  tag: 'admin' | 'ambassador' | 'student' | 'member';
}

type Filter = 'all' | 'member' | 'ambassador' | 'student' | 'admin';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Everyone' },
  { key: 'member', label: 'Community' },
  { key: 'ambassador', label: 'Ambassadors' },
  { key: 'student', label: 'Cartel students' },
  { key: 'admin', label: 'Admins' },
];

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const client = api();
    const [profilesRes, studentsRes, ambassadorsRes] = await Promise.all([
      client.supabase.from('profiles').select('id, full_name, email, role').order('full_name'),
      client.supabase.from('students').select('user_id'),
      client.supabase.from('ambassadors').select('user_id'),
    ]);

    if (profilesRes.error) {
      setError(profilesRes.error.message);
      setLoading(false);
      return;
    }

    const studentIds = new Set((studentsRes.data ?? []).map((s: { user_id: string }) => s.user_id));
    const ambassadorIds = new Set(
      (ambassadorsRes.data ?? []).map((a: { user_id: string }) => a.user_id),
    );

    setPeople(
      (profilesRes.data ?? []).map((p: any) => ({
        ...p,
        tag:
          p.role === 'admin'
            ? 'admin'
            : ambassadorIds.has(p.id)
              ? 'ambassador'
              : studentIds.has(p.id)
                ? 'student'
                : 'member',
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(
    () => ({
      all: people.length,
      member: people.filter((p) => p.tag === 'member').length,
      ambassador: people.filter((p) => p.tag === 'ambassador').length,
      student: people.filter((p) => p.tag === 'student').length,
      admin: people.filter((p) => p.tag === 'admin').length,
    }),
    [people],
  );

  const visible = people.filter((p) => {
    if (filter !== 'all' && p.tag !== filter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (p.full_name ?? '').toLowerCase().includes(q) || (p.email ?? '').toLowerCase().includes(q)
    );
  });

  if (loading) return <Spinner label="Loading people…" />;

  return (
    <>
      <PageHeader title="People" subtitle="Everyone with an Upshot account." />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <FilterPills options={FILTERS} value={filter} onChange={setFilter} counts={counts} />

      {visible.length === 0 ? (
        <EmptyState title="Nobody matches" subtitle="Try a different filter or search." />
      ) : (
        <Table head={['Name', 'Email', 'Category', '']}>
          {visible.map((p) => (
            <Row key={p.id}>
              <Cell>
                <div className="flex items-center gap-3">
                  <Avatar name={p.full_name} size={34} />
                  <span className="font-semibold">{p.full_name || 'Unnamed'}</span>
                </div>
              </Cell>
              <Cell className="text-muted">{p.email ?? '—'}</Cell>
              <Cell className="text-muted">
                {/* Mirrors the app: students and ambassadors are community
                    members; only a client account reads differently. */}
                {p.tag === 'admin'
                  ? 'Admin'
                  : p.tag === 'ambassador'
                    ? 'Community Member · Ambassador'
                    : p.tag === 'student'
                      ? 'Community Member · Cartel'
                      : 'Community Member'}
              </Cell>
              <Cell className="text-right">
                <Link href={`/people/${p.id}`} className="text-sm font-semibold underline">
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
