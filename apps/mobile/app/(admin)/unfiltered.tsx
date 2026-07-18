import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { UnfilteredVideo, UnfilteredFeatureRequest, UnfilteredFeatureRequestStatus } from '@upshot/types';
import { colors, verticalColors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

const REQUEST_STATUS_STYLE: Record<UnfilteredFeatureRequestStatus, { bg: string; fg: string; label: string }> = {
  pending: { bg: '#FEF3C7', fg: '#92400E', label: 'Pending' },
  approved: { bg: '#DCF5E1', fg: '#2C6E38', label: 'Approved' },
  contacted: { bg: '#EEF6D6', fg: '#0E0E0E', label: 'Contacted' },
  rejected: { bg: '#FEE2E2', fg: '#991B1B', label: 'Rejected' },
};

const api = createApiClient();

const UNFILTERED_COLOR = verticalColors.unfiltered;

/** Extract YouTube video ID from various URL formats */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

function getThumbnailUrl(youtubeUrl: string): string {
  const id = extractYouTubeId(youtubeUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

export default function AdminUnfilteredScreen() {
  const user = useAuthStore((s) => s.user);

  const [tab, setTab] = useState(0); // 0 = Videos, 1 = Requests
  const [videos, setVideos] = useState<UnfilteredVideo[]>([]);
  const [loading, setLoading] = useState(true);

  // Feature requests
  const [requests, setRequests] = useState<UnfilteredFeatureRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    const { data } = await api.unfiltered.getVideos(20);
    setVideos(data ?? []);
    setLoading(false);
  }, []);

  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    const { data } = await api.unfiltered.getAllFeatureRequestsAdmin();
    setRequests(data ?? []);
    setRequestsLoading(false);
  }, []);

  useEffect(() => { loadVideos(); loadRequests(); }, [loadVideos, loadRequests]);

  const pendingRequestCount = requests.filter((r) => r.status === 'pending').length;
  // Rejected requests are hidden from the admin list
  const visibleRequests = requests.filter((r) => r.status !== 'rejected');

  const handleSetRequestStatus = useCallback(
    (request: UnfilteredFeatureRequest, status: UnfilteredFeatureRequestStatus) => {
      if (!user?.id) return;
      const verb = status === 'approved' ? 'Approve' : status === 'contacted' ? 'Mark as contacted' : 'Reject';
      Alert.alert(`${verb}?`, `${request.full_name}'s request`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: verb,
          style: status === 'rejected' ? 'destructive' : 'default',
          onPress: async () => {
            const { error } = await api.unfiltered.updateFeatureRequestStatus(request.id, user.id, status);
            if (error) { showError(error); return; }
            loadRequests();
          },
        },
      ]);
    },
    [user?.id, loadRequests],
  );

  const handleAdd = useCallback(async () => {
    if (!newUrl.trim()) {
      Alert.alert('Required', 'Please enter a YouTube URL.');
      return;
    }
    if (!newTitle.trim()) {
      Alert.alert('Required', 'Please enter a title.');
      return;
    }
    if (!extractYouTubeId(newUrl.trim())) {
      Alert.alert('Invalid URL', 'Please enter a valid YouTube video URL.');
      return;
    }
    if (!user?.id) return;

    setAdding(true);
    const thumbnail = getThumbnailUrl(newUrl.trim());
    const { error } = await api.unfiltered.addVideo(user.id, {
      youtube_url: newUrl.trim(),
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      thumbnail_url: thumbnail || undefined,
      channel_url: channelUrl.trim() || undefined,
    });
    setAdding(false);

    if (error) {
      showError(error);
      return;
    }

    setNewUrl('');
    setNewTitle('');
    setNewDesc('');
    setShowForm(false);
    loadVideos();
  }, [newUrl, newTitle, newDesc, channelUrl, user?.id, loadVideos]);

  const handleDelete = useCallback((video: UnfilteredVideo) => {
    Alert.alert('Delete Video', `Remove "${video.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await api.unfiltered.deleteVideo(video.id);
          loadVideos();
        },
      },
    ]);
  }, [loadVideos]);

  const handleToggleFeatured = useCallback(async (video: UnfilteredVideo) => {
    await api.unfiltered.toggleFeatured(video.id, !video.is_featured);
    loadVideos();
  }, [loadVideos]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Unfiltered</Text>
          <Text style={styles.headerSubtitle}>
            {tab === 0
              ? `${videos.length} video${videos.length !== 1 ? 's' : ''} · Top 10 shown on app`
              : `${visibleRequests.length} feature request${visibleRequests.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
        {tab === 0 && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.8}
          >
            <Ionicons name={showForm ? 'close' : 'add'} size={20} color="#fff" />
            <Text style={styles.addBtnText}>{showForm ? 'Cancel' : 'Add Video'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 0 && styles.tabBtnActive]}
          onPress={() => setTab(0)}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, tab === 0 && styles.tabTextActive]}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 1 && styles.tabBtnActive]}
          onPress={() => setTab(1)}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, tab === 1 && styles.tabTextActive]}>
            Requests{pendingRequestCount > 0 ? ` (${pendingRequestCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {tab === 1 ? (
          /* ── Feature requests ── */
          requestsLoading ? (
            <ActivityIndicator size="large" color={UNFILTERED_COLOR} style={{ marginTop: 40 }} />
          ) : visibleRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="mic-outline" size={48} color={colors.textLight} />
              <Text style={styles.emptyTitle}>No requests yet</Text>
              <Text style={styles.emptySubtitle}>Guest feature requests will appear here</Text>
            </View>
          ) : (
            visibleRequests.map((req) => {
              const s = REQUEST_STATUS_STYLE[req.status];
              const isApproved = req.status === 'approved';
              return (
                <View key={req.id} style={styles.requestCard}>
                  <View style={styles.requestTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.requestName}>{req.full_name}</Text>
                      {!!(req.expertise || req.organisation) && (
                        <Text style={styles.requestRole} numberOfLines={1}>
                          {[req.expertise, req.organisation].filter(Boolean).join(' · ')}
                        </Text>
                      )}
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
                      <Text style={[styles.statusPillText, { color: s.fg }]}>{s.label}</Text>
                    </View>
                  </View>

                  <View style={styles.requestField}>
                    <Text style={styles.requestFieldLabel}>TOPIC</Text>
                    <Text style={styles.requestFieldValue}>{req.topic}</Text>
                  </View>
                  {!!req.bio && (
                    <View style={styles.requestField}>
                      <Text style={styles.requestFieldLabel}>ABOUT</Text>
                      <Text style={styles.requestFieldValue}>{req.bio}</Text>
                    </View>
                  )}

                  <View style={styles.requestContactRow}>
                    <Ionicons name="mail-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.requestContact} selectable>{req.email}</Text>
                  </View>
                  {!!req.phone && (
                    <View style={styles.requestContactRow}>
                      <Ionicons name="call-outline" size={13} color={colors.textSecondary} />
                      <Text style={styles.requestContact} selectable>{req.phone}</Text>
                    </View>
                  )}
                  {!!req.social_url && (
                    <View style={styles.requestContactRow}>
                      <Ionicons name="link-outline" size={13} color={colors.textSecondary} />
                      <Text style={styles.requestContact} selectable numberOfLines={1}>{req.social_url}</Text>
                    </View>
                  )}

                  <Text style={styles.requestDate}>
                    {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>

                  {isApproved ? (
                    <View style={styles.approvedRow}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                      <Text style={styles.approvedRowText}>Approved — reach out to the guest</Text>
                    </View>
                  ) : (
                    <View style={styles.requestActions}>
                      <TouchableOpacity
                        style={[styles.reqActionBtn, styles.reqActionApprove]}
                        onPress={() => handleSetRequestStatus(req, 'approved')}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="checkmark" size={15} color={colors.onPrimary} />
                        <Text style={styles.reqActionApproveText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.reqActionBtn, styles.reqActionReject]}
                        onPress={() => handleSetRequestStatus(req, 'rejected')}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="close" size={15} color={colors.error} />
                        <Text style={styles.reqActionRejectText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )
        ) : (
        <>
        {/* Add form */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formLabel}>YouTube URL *</Text>
            <TextInput
              style={styles.input}
              placeholder="https://youtu.be/..."
              placeholderTextColor={colors.textLight}
              value={newUrl}
              onChangeText={setNewUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            {!!newUrl.trim() && !!extractYouTubeId(newUrl.trim()) && (
              <Image
                source={{ uri: getThumbnailUrl(newUrl.trim()) }}
                style={styles.previewThumb}
                resizeMode="cover"
              />
            )}

            <Text style={styles.formLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Episode title"
              placeholderTextColor={colors.textLight}
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief description (optional)"
              placeholderTextColor={colors.textLight}
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Text style={styles.formLabel}>YouTube Channel / Playlist URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://youtube.com/playlist?list=..."
              placeholderTextColor={colors.textLight}
              value={channelUrl}
              onChangeText={setChannelUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            <TouchableOpacity
              style={[styles.submitBtn, adding && { opacity: 0.6 }]}
              onPress={handleAdd}
              activeOpacity={0.8}
              disabled={adding}
            >
              {adding ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={18} color="#fff" />
                  <Text style={styles.submitBtnText}>Add Video</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Videos list */}
        {loading ? (
          <ActivityIndicator size="large" color={UNFILTERED_COLOR} style={{ marginTop: 40 }} />
        ) : videos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No videos yet</Text>
            <Text style={styles.emptySubtitle}>Tap "Add Video" to add your first Unfiltered episode</Text>
          </View>
        ) : (
          videos.map((video, index) => {
            const thumb = video.thumbnail_url || getThumbnailUrl(video.youtube_url);
            return (
              <View key={video.id} style={styles.videoCard}>
                <View style={styles.videoRow}>
                  <Text style={styles.videoIndex}>{index + 1}</Text>
                  {!!thumb && (
                    <Image source={{ uri: thumb }} style={styles.videoThumb} resizeMode="cover" />
                  )}
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                    {!!video.description && (
                      <Text style={styles.videoDesc} numberOfLines={1}>{video.description}</Text>
                    )}
                    <Text style={styles.videoDate}>
                      {new Date(video.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                </View>
                <View style={styles.videoActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, video.is_featured && styles.actionBtnActive]}
                    onPress={() => handleToggleFeatured(video)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={video.is_featured ? 'star' : 'star-outline'}
                      size={16}
                      color={video.is_featured ? '#F59E0B' : colors.textSecondary}
                    />
                    <Text style={[styles.actionText, video.is_featured && { color: '#F59E0B' }]}>
                      {video.is_featured ? 'Featured' : 'Feature'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleDelete(video)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.error} />
                    <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
                {index >= 10 && (
                  <View style={styles.hiddenBadge}>
                    <Text style={styles.hiddenBadgeText}>Hidden (beyond top 10)</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
        </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Gap.base,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: UNFILTERED_COLOR,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...shadow.sm,
  },
  addBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#fff',
  },
  scrollContent: {
    padding: Gap.base,
    paddingBottom: 100,
    backgroundColor: colors.background,
  },

  // Form
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: Gap.base,
    marginBottom: Gap.base,
    borderWidth: 1,
    borderColor: UNFILTERED_COLOR + '30',
    ...shadow.md,
  },
  formLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.text,
    marginTop: Gap.md,
    marginBottom: Gap.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FontSize.body,
    color: colors.text,
  },
  textArea: {
    minHeight: 70,
  },
  previewThumb: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
    marginTop: Gap.sm,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: UNFILTERED_COLOR,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginTop: Gap.base,
    ...shadow.sm,
  },
  submitBtnText: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: '#fff',
  },

  // Video card
  videoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: Gap.sm,
    overflow: 'hidden',
    ...shadow.sm,
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  videoIndex: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.textLight,
    width: 20,
    textAlign: 'center',
  },
  videoThumb: {
    width: 80,
    height: 50,
    borderRadius: 6,
  },
  videoInfo: {
    flex: 1,
    gap: 2,
  },
  videoTitle: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.text,
    lineHeight: 18,
  },
  videoDesc: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  videoDate: {
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  videoActions: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  actionBtnActive: {
    backgroundColor: '#FEF3C7',
  },
  actionText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  hiddenBadge: {
    backgroundColor: colors.warning + '15',
    paddingVertical: 4,
    alignItems: 'center',
  },
  hiddenBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
    color: colors.warning,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Feature request card
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.base,
    marginBottom: Gap.sm,
    ...shadow.sm,
  },
  requestTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Gap.sm,
    marginBottom: Gap.md,
  },
  requestName: {
    fontSize: FontSize.h3,
    fontWeight: Font.black,
    color: colors.text,
    letterSpacing: -0.3,
  },
  requestRole: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    letterSpacing: 0.3,
  },
  requestField: {
    marginBottom: Gap.sm,
  },
  requestFieldLabel: {
    fontSize: FontSize.micro,
    fontWeight: Font.bold,
    color: colors.textLight,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  requestFieldValue: {
    fontSize: FontSize.body,
    color: colors.text,
    lineHeight: 20,
  },
  requestContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  requestContact: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    flex: 1,
  },
  requestDate: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    marginTop: Gap.sm,
  },
  requestActions: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginTop: Gap.md,
  },
  reqActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  reqActionApprove: {
    backgroundColor: colors.primary,
  },
  reqActionApproveText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.onPrimary,
  },
  reqActionReject: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  reqActionRejectText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.error,
  },
  approvedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Gap.md,
    backgroundColor: '#DCF5E1',
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: Gap.md,
  },
  approvedRowText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: '#2C6E38',
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.md,
  },
  tabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
  },
  tabBtnActive: {
    backgroundColor: colors.ink,
  },
  tabText: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
