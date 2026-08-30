'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AmbassadorCode, Vertical } from '@upshot/types';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import {
  Button,
  Card,
  Cell,
  EmptyState,
  ErrorNote,
  Field,
  Input,
  PageHeader,
  Row,
  Select,
  Spinner,
  Table,
} from '@/components/ui';

export default function AmbassadorCodesPage() {
  const { user } = useAuth();

  const [codes, setCodes] = useState<AmbassadorCode[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [codeType, setCodeType] = useState<'random' | 'custom'>('random');
  const [customCode, setCustomCode] = useState('');
  const [verticalId, setVerticalId] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    try {
      const [codeList, verticalRes] = await Promise.all([
        api().ambassadors.getAllCodes(),
        api().supabase.from('verticals').select('*').order('name'),
      ]);
      setCodes(codeList);
      setVerticals((verticalRes.data ?? []) as Vertical[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load codes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function generate() {
    if (!user) return;
    if (codeType === 'custom' && !customCode.trim()) {
      setError('Enter the code you want to issue.');
      return;
    }
    setBusyId('generate');
    try {
      await api().ambassadors.generateCode(user.id, {
        code_type: codeType,
        ...(codeType === 'custom' ? { custom_code: customCode.trim().toUpperCase() } : {}),
        ...(verticalId ? { vertical_id: verticalId } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      setCustomCode('');
      setNotes('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not generate the code.');
    } finally {
      setBusyId(null);
    }
  }

  async function deactivate(codeId: string, code: string) {
    if (!window.confirm(`Deactivate ${code}? Nobody will be able to claim it.`)) return;
    setBusyId(codeId);
    try {
      await api().ambassadors.deactivateCode(codeId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not deactivate the code.');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner label="Loading codes…" />;

  return (
    <>
      <PageHeader title="Ambassador codes" subtitle="Issue and retire the codes people sign up with." />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <Card className="mb-6 p-5">
        <h2 className="mb-4 font-bold text-ink">Issue a code</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Type">
            <Select
              value={codeType}
              onChange={(e) =>
                setCodeType((e.target as HTMLSelectElement).value as 'random' | 'custom')
              }
            >
              <option value="random">Random</option>
              <option value="custom">Custom</option>
            </Select>
          </Field>

          {codeType === 'custom' && (
            <Field label="Code">
              <Input
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                placeholder="DELHI2026"
              />
            </Field>
          )}

          <Field label="Vertical" hint="Optional.">
            <Select
              value={verticalId}
              onChange={(e) => setVerticalId((e.target as HTMLSelectElement).value)}
            >
              <option value="">None</option>
              {verticals.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Notes" hint="Optional.">
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="For the Delhi drive" />
          </Field>
        </div>

        <div className="mt-4">
          <Button variant="primary" loading={busyId === 'generate'} onClick={() => void generate()}>
            Generate
          </Button>
        </div>
      </Card>

      {codes.length === 0 ? (
        <EmptyState title="No codes yet" subtitle="Generate one above to get started." />
      ) : (
        <Table head={['Code', 'Vertical', 'Claimed by', 'Created', 'State', '']}>
          {codes.map((c) => {
            const claimed = c.is_claimed;
            return (
              <Row key={c.id}>
                <Cell className="font-mono font-bold">{c.code}</Cell>
                <Cell className="text-muted">{c.vertical?.name ?? '—'}</Cell>
                <Cell className="text-muted">{claimed ? (c.assigned_user?.full_name ?? 'Claimed') : '—'}</Cell>
                <Cell className="whitespace-nowrap text-muted">{formatDate(c.created_at)}</Cell>
                <Cell>
                  <span
                    className={`text-xs font-bold uppercase ${
                      !c.is_active ? 'text-muted' : claimed ? 'text-info' : 'text-ok'
                    }`}
                  >
                    {!c.is_active ? 'Inactive' : claimed ? 'Claimed' : 'Available'}
                  </span>
                </Cell>
                <Cell className="text-right">
                  {c.is_active && !claimed && (
                    <Button
                      size="sm"
                      variant="danger"
                      loading={busyId === c.id}
                      onClick={() => void deactivate(c.id, c.code)}
                    >
                      Deactivate
                    </Button>
                  )}
                </Cell>
              </Row>
            );
          })}
        </Table>
      )}
    </>
  );
}
