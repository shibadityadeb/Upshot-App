'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  UnfilteredFeatureRequest,
  UnfilteredFeatureRequestStatus,
  UnfilteredVideo,
} from '@upshot/types';
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
  FilterPills,
  Input,
  PageHeader,
  Row,
  Spinner,
  StatusBadge,
  Table,
  Textarea,
} from '@/components/ui';

type Tab = 'videos' | 'requests';

const REQUEST_ACTIONS: UnfilteredFeatureRequestStatus[] = ['approved', 'contacted', 'rejected'];

export default function UnfilteredPage() {
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>('videos');
  const [videos, setVideos] = useState<UnfilteredVideo[]>([]);
  const [requests, setRequests] = useState<UnfilteredFeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const load = useCallback(async () => {
    const [videoRes, requestRes] = await Promise.all([
      api().unfiltered.getVideos(50),
      api().unfiltered.getAllFeatureRequestsAdmin(),
    ]);
    if (videoRes.error) setError(videoRes.error.message);
    setVideos(videoRes.data ?? []);
    setRequests(requestRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addVideo() {
    if (!user) return;
    if (!url.trim() || !title.trim()) {
      setError('A YouTube URL and a title are both required.');
      return;
    }
    setBusyId('add');
    try {
      const res = await api().unfiltered.addVideo(user.id, {
        youtube_url: url.trim(),
        title: title.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
      });
      if (res.error) setError(res.error.message);
      else {
        setUrl('');
        setTitle('');
        setDescription('');
        await load();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeatured(video: UnfilteredVideo) {
    setBusyId(video.id + 'feature');
    try {
      const res = await api().unfiltered.toggleFeatured(video.id, !video.is_featured);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  async function removeVideo(video: UnfilteredVideo) {
    if (!window.confirm(`Delete "${video.title}"?`)) return;
    setBusyId(video.id + 'delete');
    try {
      const res = await api().unfiltered.deleteVideo(video.id);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  async function setRequestStatus(id: string, status: UnfilteredFeatureRequestStatus) {
    if (!user) return;
    setBusyId(id + status);
    try {
      const res = await api().unfiltered.updateFeatureRequestStatus(id, user.id, status);
      if (res.error) setError(res.error.message);
      else await load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner label="Loading Unfiltered…" />;

  return (
    <>
      <PageHeader title="Unfiltered" subtitle="Episodes on the app, and the people asking to be on." />

      {error && <ErrorNote message={error} onDismiss={() => setError(null)} />}

      <FilterPills
        options={[
          { key: 'videos' as Tab, label: 'Episodes' },
          { key: 'requests' as Tab, label: 'Guest requests' },
        ]}
        value={tab}
        onChange={setTab}
        counts={{
          videos: videos.length,
          requests: requests.filter((r) => r.status === 'pending').length,
        }}
      />

      {tab === 'videos' ? (
        <>
          <Card className="mb-6 p-5">
            <h2 className="mb-4 font-bold text-ink">Add an episode</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="YouTube URL">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtu.be/…"
                />
              </Field>
              <Field label="Title">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Episode title" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description" hint="Optional.">
                <Textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Button variant="primary" loading={busyId === 'add'} onClick={() => void addVideo()}>
                Add episode
              </Button>
            </div>
          </Card>

          {videos.length === 0 ? (
            <EmptyState title="No episodes yet" subtitle="Add one above — the featured episode leads the app's home screen." />
          ) : (
            <Table head={['Episode', 'Added', 'Featured', '']}>
              {videos.map((v) => (
                <Row key={v.id}>
                  <Cell>
                    <p className="font-semibold">{v.title}</p>
                    <a
                      href={v.youtube_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-info underline"
                    >
                      {v.youtube_url}
                    </a>
                  </Cell>
                  <Cell className="whitespace-nowrap text-muted">{formatDate(v.created_at)}</Cell>
                  <Cell>{v.is_featured ? <StatusBadge status="active" /> : <span className="text-muted">—</span>}</Cell>
                  <Cell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant={v.is_featured ? 'secondary' : 'primary'}
                        loading={busyId === v.id + 'feature'}
                        onClick={() => void toggleFeatured(v)}
                      >
                        {v.is_featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={busyId === v.id + 'delete'}
                        onClick={() => void removeVideo(v)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Cell>
                </Row>
              ))}
            </Table>
          )}
        </>
      ) : requests.length === 0 ? (
        <EmptyState title="No requests" subtitle="People applying to feature on Unfiltered appear here." />
      ) : (
        <Table head={['Person', 'Topic', 'Sent', 'Status', '']}>
          {requests.map((r) => (
            <Row key={r.id}>
              <Cell>
                <p className="font-semibold">{r.full_name}</p>
                <p className="text-xs text-muted">{r.email}</p>
                {r.organisation && <p className="text-xs text-muted">{r.organisation}</p>}
              </Cell>
              <Cell className="max-w-xs text-muted">{r.topic}</Cell>
              <Cell className="whitespace-nowrap text-muted">{formatDate(r.created_at)}</Cell>
              <Cell>
                <StatusBadge status={r.status} />
              </Cell>
              <Cell className="text-right">
                <div className="flex justify-end gap-2">
                  {REQUEST_ACTIONS.filter((s) => s !== r.status).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={s === 'rejected' ? 'danger' : s === 'approved' ? 'primary' : 'secondary'}
                      loading={busyId === r.id + s}
                      onClick={() => void setRequestStatus(r.id, s)}
                    >
                      {s === 'approved' ? 'Approve' : s === 'contacted' ? 'Mark contacted' : 'Reject'}
                    </Button>
                  ))}
                </div>
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
}
