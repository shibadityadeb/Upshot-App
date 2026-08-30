'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CreateTaskPayload, TaskTargetGroup } from '@upshot/types';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button, Card, ErrorNote, Field, Input, PageHeader, Select, Textarea } from '@/components/ui';

const GROUPS: { value: TaskTargetGroup; label: string }[] = [
  { value: 'campus_cartel', label: 'Campus Cartel' },
  { value: 'students', label: 'Students' },
  { value: 'ambassadors', label: 'Ambassadors' },
];

interface PersonOption {
  id: string;
  full_name: string | null;
  email: string | null;
}

export default function NewTaskPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coinValue, setCoinValue] = useState('10');
  const [dueDate, setDueDate] = useState('');
  const [assignMode, setAssignMode] = useState<'group' | 'person'>('group');
  const [targetGroup, setTargetGroup] = useState<TaskTargetGroup>('campus_cartel');
  const [assignedTo, setAssignedTo] = useState('');
  const [people, setPeople] = useState<PersonOption[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const { data } = await api()
        .supabase.from('profiles')
        .select('id, full_name, email')
        .order('full_name');
      setPeople((data ?? []) as PersonOption[]);
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const coins = parseInt(coinValue, 10);
    if (!Number.isFinite(coins) || coins < 0) {
      setError('Coin value must be a number.');
      return;
    }
    if (assignMode === 'person' && !assignedTo) {
      setError('Pick who this task is for.');
      return;
    }

    const payload: CreateTaskPayload = {
      title: title.trim(),
      description: description.trim(),
      coin_value: coins,
      ...(dueDate ? { due_date: dueDate } : {}),
      ...(assignMode === 'group' ? { target_group: targetGroup } : { assigned_to: assignedTo }),
    };

    setBusy(true);
    try {
      const res = await api().tasks.createTask(user.id, payload);
      if (res.error) setError(res.error.message);
      else router.push('/tasks');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Link href="/tasks" className="mb-4 inline-block text-sm font-semibold text-muted hover:underline">
        ← Tasks
      </Link>

      <PageHeader title="New task" subtitle="Set work for a group or one person." />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <Card className="max-w-2xl p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post three campus reels"
              required
            />
          </Field>

          <Field label="Description">
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What has to be done, and what counts as finished."
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Coin reward">
              <Input
                type="number"
                min={0}
                value={coinValue}
                onChange={(e) => setCoinValue(e.target.value)}
                required
              />
            </Field>
            <Field label="Due date" hint="Optional.">
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Field>
          </div>

          <Field label="Assign to">
            <Select
              value={assignMode}
              onChange={(e) => setAssignMode((e.target as HTMLSelectElement).value as 'group' | 'person')}
            >
              <option value="group">A group</option>
              <option value="person">One person</option>
            </Select>
          </Field>

          {assignMode === 'group' ? (
            <Field label="Group">
              <Select
                value={targetGroup}
                onChange={(e) =>
                  setTargetGroup((e.target as HTMLSelectElement).value as TaskTargetGroup)
                }
              >
                {GROUPS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </Select>
            </Field>
          ) : (
            <Field label="Person">
              <Select
                value={assignedTo}
                onChange={(e) => setAssignedTo((e.target as HTMLSelectElement).value)}
              >
                <option value="">Select someone…</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name || p.email || p.id}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={busy}
              disabled={!title.trim() || !description.trim()}
            >
              Create task
            </Button>
            <Link href="/tasks">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </>
  );
}
