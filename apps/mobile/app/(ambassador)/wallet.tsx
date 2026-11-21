import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { WalletBalance, CoinTransaction } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { LoadingScreen, EmptyState } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { showError } from '../../src/store/error.store';

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

function isPositive(type: CoinTransaction['type']) {
  return type === 'earned' || type === 'bonus';
}

export default function AmbassadorWallet() {
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

  const loadTransactionsPage = useCallback(
    async (pageNum: number, append: boolean, currentCount: number) => {
      if (!user) return;
      const result = await api.coins.getTransactionHistory(user.id, pageNum, 20);
      if (result.data) {
        const items = result.data.data ?? [];
        setTransactions((prev) => (append ? [...prev, ...items] : items));
        const totalCount = result.data.count ?? items.length;
        const fetched = append ? currentCount + items.length : items.length;
        setHasMore(fetched < totalCount);
      }
    },
    [user]
  );

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [balanceResult] = await Promise.all([
        api.coins.getWalletBalance(user.id),
        loadTransactionsPage(1, false, 0),
      ]);
      if (balanceResult.data) setBalance(balanceResult.data);
      setPage(1);
    } catch {
      showError(null, { context: 'Failed to load wallet data.' });
    }
  }, [user, loadTransactionsPage]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const onLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await loadTransactionsPage(nextPage, true, transactions.length);
    setPage(nextPage);
    setLoadingMore(false);
  }, [hasMore, loadingMore, page, transactions.length, loadTransactionsPage]);

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, columnStyle]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Lime liquid hero — the balance is the hero */}
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
            <Text style={styles.balanceUnit}>coins available</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{balance?.total_earned ?? 0}</Text>
                <Text style={styles.statLabel}>Earned</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{balance?.total_redeemed ?? 0}</Text>
                <Text style={styles.statLabel}>Redeemed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transaction list */}
        {transactions.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <EmptyState
              icon="🪙"
              title="No transactions yet"
              subtitle="Your coin transactions will appear here"
            />
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transaction History</Text>
            </View>
            <View style={styles.txList}>
              {transactions.map((item) => {
                const pos = isPositive(item.type);
                const icon = TX_ICONS[item.type] ?? '🪙';
                return (
                  <View key={item.id} style={styles.txCard}>
                    <View style={[styles.txIconBubble, { backgroundColor: pos ? '#EAF4EC' : colors.surfaceAlt }]}>
                      <Text style={styles.txIconText}>{icon}</Text>
                    </View>
                    <View style={styles.txMid}>
                      <Text style={styles.txDesc} numberOfLines={2}>
                        {item.description}
                      </Text>
                      <View style={styles.txMetaRow}>
                        <View style={styles.coinDot} />
                        <Text style={styles.txDate}>
                          {new Date(item.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.txAmount,
                        { color: pos ? colors.success : colors.error },
                      ]}
                    >
                      {pos ? '+' : '-'}{Math.abs(item.amount)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {hasMore && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={onLoadMore}
                disabled={loadingMore}
                activeOpacity={0.8}
              >
                <Text style={styles.loadMoreText}>
                  {loadingMore ? 'Loading…' : 'Load more'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
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

  // ── Section header ──
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
  txList: {
    paddingHorizontal: Gap.base,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
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
    gap: 6,
  },
  coinDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COIN_GOLD,
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

  // ── Load more ──
  loadMoreBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Gap.sm,
    marginHorizontal: Gap.base,
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

  // ── Empty ──
  emptyWrapper: {
    paddingTop: Gap.xl,
    paddingHorizontal: Gap.base,
  },
});
