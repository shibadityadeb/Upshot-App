import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { CampusCartelMember, CampusCartelStatus } from '@upshot/api-client';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import {
  AvatarCircle,
  Button,
  Card,
  EmptyState,
  FilterPills,
  StatusBadge,
} from '../../src/components/common';

const api = createApiClient();

type Filter = 'pending' | 'approved' | 'rejected' | 'all';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

type MemberWithProfile = CampusCartelMember & { profile?: { id: string; full_name: string; avatar_url: string | null; email?: string } };

export default function AdminCampusCartel() {
  const router = useRouter();

  const [applications, setApplications] = useState<MemberWithProfile[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    try {
      const statusFilter = filter === 'all' ? undefined : filter as CampusCartelStatus;
      const result = await api.campusCartel.getApplications(statusFilter);
      if (result.data) setApplications(result.data as MemberWithProfile[]);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadApplications();
    }, [loadApplications]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadApplications();
  }, [loadApplications]);

  const handleApprove = useCallback(async (id: string) => {
    setActionLoading(id + 'approve');
    try {
      const result = await api.campusCartel.approveApplication(id);
      if (result.error) Alert.alert('Error', result.error.message);
      else await loadApplications();
    } finally {
      setActionLoading(null);
    }
  }, [loadApplications]);

  const handleReject = useCallback((id: string) => {
    if (Platform.OS === 'ios') {
      Alert.prompt('Reject Application', 'Enter a reason (optional)', async (reason) => {
        setActionLoading(id + 'reject');
        try {
          const result = await api.campusCartel.rejectApplication(id, reason ?? undefined);
          if (result.error) Alert.alert('Error', result.error.message);
          else await loadApplications();
        } finally {
          setActionLoading(null);
        }
      }, 'plain-text');
    } else {
      Alert.alert('Reject Application', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(id + 'reject');
            try {
              await api.campusCartel.rejectApplication(id);
              await loadApplications();
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]);
    }
  }, [loadApplications]);

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  const statusColor = (s: CampusCartelStatus) => {
    if (s === 'approved') return colors.success;
    if (s === 'rejected') return colors.error;
    return '#D97706';
  };

  const renderApplication = ({ item }: { item: MemberWithProfile }) => {
    const name = item.profile?.full_name ?? 'Unknown';
    const isPending = item.status === 'pending';
    const approvingThis = actionLoading === item.id + 'approve';
    const rejectingThis = actionLoading === item.id + 'reject';
    const isActioning = approvingThis || rejectingThis;

    return (
      <Card style={styles.appCard}>
        <View style={styles.appHeader}>
          <View style={styles.appUser}>
            <AvatarCircle name={name} size={36} avatarUrl={item.profile?.avatar_url} />
            <View style={styles.appUserInfo}>
              <Text style={styles.appName}>{name}</Text>
              {item.profile?.email && (
                <Text style={styles.appEmail} numberOfLines={1}>{item.profile.email}</Text>
              )}
            </View>
          </View>
          <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]}>
            <Text style={styles.statusDotText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          {item.college && (
            <View style={styles.detailItem}>
              <Ionicons name="school-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.detailText}>{item.college}</Text>
            </View>
          )}
          {item.course && (
            <View style={styles.detailItem}>
              <Ionicons name="book-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.detailText}>{item.course}</Text>
            </View>
          )}
          {item.city && (
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.detailText}>{item.city}</Text>
            </View>
          )}
          {item.ambassador_code && (
            <View style={styles.detailItem}>
              <Ionicons name="code-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.detailText}>Code: {item.ambassador_code}</Text>
            </View>
          )}
        </View>

        <Text style={styles.dateText}>
          Applied {new Date(item.joined_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>

        {isPending && (
          <View style={styles.actionRow}>
            <Button
              title="Approve"
              variant="primary"
              size="sm"
              style={[styles.actionBtn, { backgroundColor: colors.campusCartelGreen }]}
              onPress={() => handleApprove(item.id)}
              disabled={isActioning}
              loading={approvingThis}
            />
            <Button
              title="Reject"
              variant="outline"
              size="sm"
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(item.id)}
              disabled={isActioning}
              loading={rejectingThis}
            />
          </View>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.campusCartelGreen} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Campus Cartel</Text>
            <Text style={styles.heroSub}>
              {filter === 'pending' && pendingCount > 0
                ? `${pendingCount} pending application${pendingCount > 1 ? 's' : ''}`
                : `${applications.length} application${applications.length !== 1 ? 's' : ''}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Filter pills */}
      <FilterPills
        options={FILTERS.map((f) => ({ label: f.label, value: f.key }))}
        activeValue={filter}
        onChange={(v) => {
          setFilter(v as Filter);
          setLoading(true);
        }}
      />

      {/* List */}
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderApplication}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.campusCartelGreen} />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="people-outline"
            title={filter === 'pending' ? 'No pending applications' : `No ${filter} applications`}
            subtitle="Applications will appear here"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  // Hero
  hero: {
    backgroundColor: colors.background,
    paddingHorizontal: Gap.base,
    paddingTop: 12,
    paddingBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: Font.black,
    color: colors.text,
  },
  heroSub: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // List
  listContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: 80,
    flexGrow: 1,
  },
  appCard: {
    marginBottom: Gap.sm,
    padding: Gap.base,
    borderRadius: radius.lg,
    ...shadow.sm,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.md,
  },
  appUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    flex: 1,
  },
  appUserInfo: {
    flex: 1,
  },
  appName: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.text,
  },
  appEmail: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  statusDot: {
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusDotText: {
    fontSize: FontSize.xs,
    fontWeight: Font.bold,
    color: '#fff',
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.md,
    marginBottom: Gap.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: FontSize.xs,
    color: colors.textLight,
    marginBottom: Gap.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginTop: Gap.md,
  },
  actionBtn: {
    flex: 1,
  },
  rejectBtn: {
    borderColor: colors.error,
  },
});
