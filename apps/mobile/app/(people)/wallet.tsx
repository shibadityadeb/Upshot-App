import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { WalletBalance, CoinTransaction } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { Badge, CoinBadge, EmptyState } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

// Gold coin accent — the reward currency's colour language.
const COIN_GOLD = '#E3A017';
const COIN_AMBER = '#92400E';

const TX_ICONS: Record<string, string> = {
  earned: '🪙',
  bonus: '🎯',
  redeemed: '💸',
  penalty: '⚡',
};

function isPositive(type: string) {
  return type === 'earned' || type === 'bonus';
}

export default function PeopleWallet() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadBalance = useCallback(async () => {
    if (!user) return;
    try {
      const result = await api.coins.getWalletBalance(user.id);
      if (result.data) setBalance(result.data);
    } catch (e) {
      console.warn(e);
    }
  }, [user]);

  const loadTransactions = useCallback(
    async (pageNum: number, append: boolean) => {
      if (!user) return;
      try {
        const result = await api.coins.getTransactionHistory(user.id, pageNum, 20);
        if (result.data) {
          const items = (result.data as any).data ?? result.data ?? [];
          setTransactions((prev) => (append ? [...prev, ...items] : items));
          setHasMore(pageNum < ((result.data as any).total_pages ?? 1));
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [user],
  );


  const initialLoad = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadBalance(), loadTransactions(1, false)]);
    setPage(1);
    setLoading(false);
  }, [loadBalance, loadTransactions]);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadBalance(), loadTransactions(1, false)]);
    setPage(1);
    setRefreshing(false);
  }, [loadBalance, loadTransactions]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    await loadTransactions(next, true);
    setPage(next);
    setLoadingMore(false);
  }, [hasMore, loadingMore, page, loadTransactions]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: CoinTransaction }) => {
    const pos = isPositive(item.type);
    return (
      <View style={styles.txCard}>
        <View style={[styles.txIconBubble, { backgroundColor: pos ? '#EAF4EC' : colors.surfaceAlt }]}>
          <Text style={styles.txIconText}>{TX_ICONS[item.type] ?? '🪙'}</Text>
        </View>
        <View style={styles.txMid}>
          <Text style={styles.txDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.txMetaRow}>
            <Text style={styles.txDate}>
              {new Date(item.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
            <Badge
              label={item.type}
              color={pos ? colors.success : colors.error}
            />
          </View>
        </View>
        <Text style={[styles.txAmount, { color: pos ? colors.success : colors.error }]}>
          {pos ? '+' : '-'}{Math.abs(item.amount)}
        </Text>
      </View>
    );
  };

  const header = (
    <View>
      {/* Lime liquid header — the balance is the hero */}
      <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.heroBg} resizeMode="cover" />
        <View style={[styles.heroInner, columnStyle]}>
          <Text style={styles.eyebrow}>YOUR REWARDS</Text>
          <View style={styles.balanceRow}>
            <View style={styles.coinAccent}>
              <Ionicons name="diamond" size={24} color={COIN_AMBER} />
            </View>
            <Text style={styles.balanceAmount}>{balance?.current_balance ?? 0}</Text>
          </View>
          <Text style={styles.balanceUnit}>rewards available</Text>
          <View style={styles.coinBadgeWrap}>
            <CoinBadge amount={balance?.current_balance ?? 0} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{balance?.total_earned ?? 0}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{balance?.total_redeemed ?? 0}</Text>
              <Text style={styles.statLabel}>Redeemed</Text>
            </View>
          </View>
        </View>
      </View>

      {transactions.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
        </View>
      )}
    </View>
  );


  const footer = (
    <View style={styles.footer}>
      {hasMore && (
        <TouchableOpacity
          style={styles.loadMoreBtn}
          onPress={handleLoadMore}
          disabled={loadingMore}
          activeOpacity={0.8}
        >
          <Text style={styles.loadMoreText}>
            {loadingMore ? 'Loading...' : 'Load more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <EmptyState
              icon="🪙"
              title="No transactions yet"
              subtitle="Complete assignments to earn rewards"
            />
          </View>
        }
        contentContainerStyle={[styles.listContent, columnStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingBottom: 110,
    flexGrow: 1,
  },

  // ── Hero (lime liquid) ──
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  heroBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  heroInner: { alignItems: 'center' },
  eyebrow: {
    fontSize: FontSize.xs,
    fontWeight: Font.black,
    color: '#2c3326',
    letterSpacing: 2,
    marginTop: Gap.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    marginTop: Gap.md,
  },
  coinAccent: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COIN_GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.65)',
    ...shadow.sm,
  },
  balanceAmount: {
    fontSize: 56,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -1.5,
  },
  balanceUnit: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: '#2c3326',
    marginTop: 2,
    marginBottom: Gap.sm,
  },
  coinBadgeWrap: {
    marginBottom: Gap.base,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Gap.xs,
    backgroundColor: 'rgba(14,14,14,0.08)',
    borderRadius: radius.xl,
    paddingVertical: Gap.md,
    paddingHorizontal: Gap.xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: Gap.xl,
  },
  statValue: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: '#2c3326',
    fontWeight: Font.semibold,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(14,14,14,0.18)',
  },

  // ── Section ──
  sectionHeader: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
    paddingBottom: Gap.md,
  },
  sectionTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.6,
  },

  // ── Transaction cards ──
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
    marginHorizontal: Gap.base,
    marginBottom: Gap.sm,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    ...shadow.sm,
  },
  txIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconText: {
    fontSize: 20,
  },
  txMid: {
    flex: 1,
    gap: 5,
  },
  txDesc: {
    fontSize: FontSize.body,
    fontWeight: Font.bold,
    color: colors.ink,
    lineHeight: 19,
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
  },
  txDate: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    fontWeight: Font.medium,
  },
  txAmount: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    letterSpacing: -0.4,
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: Gap.base,
  },
  loadMoreBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Gap.sm,
    paddingVertical: 13,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  loadMoreText: {
    fontSize: FontSize.small,
    fontWeight: Font.black,
    color: colors.ink,
  },
  emptyWrapper: {
    paddingTop: Gap.xl,
    paddingHorizontal: Gap.base,
  },

});
