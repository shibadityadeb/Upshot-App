'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { isTaskVisible, taskDueState } from '@upshot/types';
import type { Task } from '@upshot/types';
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

type Filter = 'submitted' | 'assigned' | 'approved' | 'rejected' | 'all';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'submitted', label: 'Needs review' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

export default function TasksPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('submitted');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api().tasks.getAllTasksAdmin();
    if (res.error) setError(res.error.message);
    else setTasks(res.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // A task drops off a week after its due date passes — the same window the
  // in-app admin section uses, since both read it from @upshot/types.
  const liveTasks = useMemo(() => tasks.filter((t) => isTaskVisible(t, 'admin')), [tasks]);

  const counts = useMemo(
    () => ({
      submitted: liveTasks.filter((t) => t.status === 'submitted').length,
      assigned: liveTasks.filter((t) => t.status === 'assigned').length,
      approved: liveTasks.filter((t) => t.status === 'approved').length,
      rejected: liveTasks.filter((t) => t.status === 'rejected').length,
      all: liveTasks.length,
    }),
    [liveTasks],
  );

  const visible = liveTasks.filter((t) => filter === 'all' || t.status === filter);

  async function review(taskId: string, approved: boolean) {
    if (!user) return;
    setBusyId(taskId + String(approved));
    try {
      const res = await api().tasks.reviewTask(taskId, user.id, approved);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(taskId: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusyId(taskId + 'delete');
    try {
      const res = await api().tasks.deleteTask(taskId);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner label="Loading tasks…" />;

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle="Review what people submit, and set new work."
        action={
          <Link href="/tasks/new">
            <Button variant="primary">New task</Button>
          </Link>
        }
      />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <FilterPills options={FILTERS} value={filter} onChange={setFilter} counts={counts} />

      {visible.length === 0 ? (
        <EmptyState title="Nothing here" subtitle="Try another filter, or create a task." />
      ) : (
        <Table head={['Task', 'Assigned to', 'Due', 'Coins', 'Status', '']}>
          {visible.map((t) => {
            const assignee = t.assignee?.full_name ?? (t.target_group ? `Group · ${t.target_group.replace(/_/g, ' ')}` : '—');
            const busy = busyId?.startsWith(t.id) ?? false;
            const dueState = taskDueState(t.due_date, 'admin');
            return (
              <Row key={t.id}>
                <Cell>
                  <p className="font-semibold">{t.title}</p>
                  {t.submission_url && (
                    <a
                      href={t.submission_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-info underline"
                    >
                      View submission
                    </a>
                  )}
                </Cell>
                <Cell className="text-muted">{assignee}</Cell>
                <Cell className="whitespace-nowrap">
                  <p className="text-muted">{formatDate(t.due_date)}</p>
                  {/* Every dated task says where it stands, so the All filter
                      reads at a glance. */}
                  {dueState === 'overdue' && (
                    <span className="mt-1 inline-block rounded-full bg-danger/15 px-2 py-0.5 text-[11px] font-bold text-danger">
                      Due date passed
                    </span>
                  )}
                  {dueState === 'ongoing' && (
                    <span className="mt-1 inline-block rounded-full bg-lime-tint px-2 py-0.5 text-[11px] font-bold text-ink">
                      Ongoing
                    </span>
                  )}
                </Cell>
                <Cell className="text-muted">{t.coin_value}</Cell>
                <Cell>
                  <StatusBadge status={t.status} />
                </Cell>
                <Cell className="text-right">
                  <div className="flex justify-end gap-2">
                    {t.status === 'submitted' && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          loading={busyId === t.id + 'true'}
                          disabled={busy}
                          onClick={() => void review(t.id, true)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          loading={busyId === t.id + 'false'}
                          disabled={busy}
                          onClick={() => void review(t.id, false)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={busyId === t.id + 'delete'}
                      disabled={busy}
                      onClick={() => void remove(t.id, t.title)}
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
