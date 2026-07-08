import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { LeaderboardEntry } from '@upshot/api-client';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { AvatarCircle, Badge, EmptyState, SegmentedControl } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();
const MEDALS = ['gold-outline', 'medal-outline', 'ribbon-outline'] as const;
const MEDAL_COLORS = ['#F59E0B', '#9CA3AF', '#CD7F32'];
const FILTER_TABS = ['All', 'My College'];

export default function LeaderboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterIdx, setFilterIdx] = useState(0);
  const [myCollege, setMyCollege] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const result = await api.campusCartel.getLeaderboard(100);
      if (result.data) setEntries(result.data);

      // Get user's college for filtering
      const rank = await api.campusCartel.getMyRank(user.id);
      if (rank.data?.college) setMyCollege(rank.data.college);
    } catch {
      // silent
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const filtered =
    filterIdx === 1 && myCollege
      ? entries.filter((e) => e.college === myCollege)
      : entries;

  const topThree = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.campusCartelGreen} />
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Ionicons name="trophy" size={22} color="#F59E0B" />
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      {/* Filter tabs */}
      <SegmentedControl
        segments={FILTER_TABS}
        activeIndex={filterIdx}
        onChange={setFilterIdx}
      />

      {/* Podium */}
      {topThree.length > 0 && (
        <View style={styles.podium}>
          {/* Rank 2 left */}
          {topThree.length >= 2 && (
            <View style={styles.podiumSide}>
              <AvatarCircle name={topThree[1].full_name} size={48} />
              <Ionicons name="medal-outline" size={18} color={MEDAL_COLORS[1]} />
              <Text style={styles.podiumName} numberOfLines={1}>
                {topThree[1].full_name}
              </Text>
              <Text style={styles.podiumCoins}>{topThree[1].total_earned}</Text>
            </View>
          )}

          {/* Rank 1 center */}
          <View style={styles.podiumCenter}>
            <AvatarCircle name={topThree[0].full_name} size={64} />
            <Ionicons name="trophy" size={22} color={MEDAL_COLORS[0]} />
            <Text style={styles.podiumNameCenter} numberOfLines={1}>
              {topThree[0].full_name}
            </Text>
            <Text style={styles.podiumCoinsCenter}>{topThree[0].total_earned}</Text>
          </View>

          {/* Rank 3 right */}
          {topThree.length >= 3 && (
            <View style={styles.podiumSide}>
              <AvatarCircle name={topThree[2].full_name} size={48} />
              <Ionicons name="ribbon-outline" size={18} color={MEDAL_COLORS[2]} />
              <Text style={styles.podiumName} numberOfLines={1}>
                {topThree[2].full_name}
              </Text>
              <Text style={styles.podiumCoins}>{topThree[2].total_earned}</Text>
            </View>
          )}
        </View>
      )}

      {rest.length > 0 && (
        <View style={styles.listSectionHeader}>
          <Text style={styles.listSectionTitle}>Rankings</Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: LeaderboardEntry }) => {
    const isMe = item.user_id === user?.id;
    return (
      <View style={[styles.row, isMe && styles.rowHighlight]}>
        <Text style={styles.rankNum}>{item.rank}</Text>
        <AvatarCircle name={item.full_name} size={38} />
        <View style={styles.rowInfo}>
          <Text style={styles.rowName} numberOfLines={1}>
            {item.full_name}
            {isMe && <Text style={styles.youTag}> (You)</Text>}
          </Text>
          {item.college && (
            <Text style={styles.rowCollege} numberOfLines={1}>{item.college}</Text>
          )}
        </View>
        <View style={styles.rowRight}>
          <Text style={styles.rowCoins}>{item.total_earned}</Text>
          {item.ambassador_tier && (
            <Badge label={item.ambassador_tier} color={colors.warning} size="sm" />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={rest}
        keyExtractor={(item) => item.user_id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.campusCartelGreen} />
        }
        ListEmptyComponent={
          topThree.length === 0 ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                iconName="trophy-outline"
                title="No rankings yet"
                subtitle="Be the first to earn coins and claim the top spot"
              />
            </View>
          ) : null
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
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyWrap: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
  },

  // Header
  header: {
    backgroundColor: colors.campusCartelGreen,
    paddingTop: Gap.sm,
    paddingBottom: Gap.lg,
    paddingHorizontal: Gap.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },

  // Podium
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: Gap.xl,
    paddingHorizontal: Gap.base,
    backgroundColor: colors.surface,
    gap: Gap.lg,
  },
  podiumCenter: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  podiumSide: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
    paddingTop: Gap.lg,
  },
  podiumName: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.text,
    textAlign: 'center',
    maxWidth: 90,
  },
  podiumNameCenter: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.text,
    textAlign: 'center',
    maxWidth: 110,
  },
  podiumCoins: {
    fontSize: FontSize.small,
    fontWeight: Font.bold,
    color: colors.textSecondary,
  },
  podiumCoinsCenter: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.campusCartelGreen,
  },

  // Section header
  listSectionHeader: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.lg,
    paddingBottom: Gap.md,
    backgroundColor: colors.background,
  },
  listSectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
    gap: Gap.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rowHighlight: {
    backgroundColor: '#EEF0FB',
  },
  rankNum: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.textSecondary,
    width: 28,
    textAlign: 'center',
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.text,
  },
  youTag: {
    fontWeight: Font.medium,
    color: colors.campusCartelGreen,
  },
  rowCollege: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rowCoins: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.text,
  },
});
