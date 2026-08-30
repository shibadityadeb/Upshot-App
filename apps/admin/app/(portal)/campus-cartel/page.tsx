'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import {
  Avatar,
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

type Filter = 'pending' | 'approved' | 'rejected' | 'all';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

interface Member {
  id: string;
  user_id: string;
  status: string;
  college?: string | null;
  created_at: string;
  profile?: { full_name?: string | null; email?: string | null };
}

export default function CampusCartelPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api().campusCartel.getApplications();
    if (res.error) setError(res.error.message);
    else setMembers((res.data ?? []) as unknown as Member[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(
    () => ({
      pending: members.filter((m) => m.status === 'pending').length,
      approved: members.filter((m) => m.status === 'approved').length,
      rejected: members.filter((m) => m.status === 'rejected').length,
      all: members.length,
    }),
    [members],
  );

  const visible = members.filter((m) => filter === 'all' || m.status === filter);

  async function decide(memberId: string, approve: boolean) {
    setBusyId(memberId + String(approve));
    try {
      // Approving also issues the member's ambassador code (see the service).
      const res = approve
        ? await api().campusCartel.approveApplication(memberId)
        : await api().campusCartel.rejectApplication(memberId, 'Rejected by admin');
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner label="Loading applications…" />;

  return (
    <>
      <PageHeader title="Campus Cartel" subtitle="Applications to join the student community." />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <FilterPills options={FILTERS} value={filter} onChange={setFilter} counts={counts} />

      {visible.length === 0 ? (
        <EmptyState title="Nothing here" subtitle="Applications from the app land in Pending." />
      ) : (
        <Table head={['Applicant', 'College', 'Applied', 'Status', '']}>
          {visible.map((m) => (
            <Row key={m.id}>
              <Cell>
                <div className="flex items-center gap-3">
                  <Avatar name={m.profile?.full_name} size={34} />
                  <div>
                    <p className="font-semibold">{m.profile?.full_name || 'Unknown'}</p>
                    <p className="text-xs text-muted">{m.profile?.email}</p>
                  </div>
                </div>
              </Cell>
              <Cell className="text-muted">{m.college || '—'}</Cell>
              <Cell className="whitespace-nowrap text-muted">{formatDate(m.created_at)}</Cell>
              <Cell>
                <StatusBadge status={m.status} />
              </Cell>
              <Cell className="text-right">
                {m.status === 'pending' && (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      loading={busyId === m.id + 'true'}
                      onClick={() => void decide(m.id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      loading={busyId === m.id + 'false'}
                      onClick={() => void decide(m.id, false)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
}
