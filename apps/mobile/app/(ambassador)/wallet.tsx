import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import type { WalletBalance, CoinTransaction } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import { LoadingScreen, EmptyState } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

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
      Alert.alert('Error', 'Failed to load wallet data.');
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Dark balance header */}
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>YOUR REWARDS</Text>
          <Text style={styles.balanceAmount}>{balance?.current_balance ?? 0}</Text>
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
            <View style={styles.txCard}>
              {transactions.map((item, index) => {
                const pos = isPositive(item.type);
                const icon = TX_ICONS[item.type] ?? '🪙';
                return (
                  <View key={item.id}>
                    <View style={styles.txRow}>
                      <View style={styles.txIconBubble}>
                        <Text style={styles.txIconText}>{icon}</Text>
                      </View>
                      <View style={styles.txMid}>
                        <Text style={styles.txDesc} numberOfLines={2}>
                          {item.description}
                        </Text>
                        <Text style={styles.txDate}>
                          {new Date(item.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </Text>
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
                    {index < transactions.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                );
              })}
            </View>

            {hasMore && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={onLoadMore}
                disabled={loadingMore}
                activeOpacity={0.7}
              >
                <Text style={styles.loadMoreText}>
                  {loadingMore ? 'Loading…' : 'Load more'}
                </Text>
              </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 100,
  },

  // Balance header
  balanceHeader: {
    backgroundColor: colors.dark,
    paddingTop: Gap.lg,
    paddingBottom: Gap.xl,
    paddingHorizontal: Gap.base,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: FontSize.micro,
    fontWeight: Font.bold,
    color: colors.accent,
    letterSpacing: 2,
  },
  balanceAmount: {
    fontSize: 52,
    fontWeight: Font.black,
    color: '#FFFFFF',
    marginTop: Gap.sm,
    letterSpacing: -1,
  },
  balanceUnit: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Gap.xl,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingVertical: Gap.md,
    paddingHorizontal: Gap.xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: Gap.xl,
  },
  statValue: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // Section header
  sectionHeader: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
    paddingBottom: Gap.md,
  },
  sectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
  },

  // Transaction card
  txCard: {
    backgroundColor: colors.surface,
    marginHorizontal: Gap.base,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: Gap.md,
  },
  txIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconText: {
    fontSize: 18,
  },
  txMid: {
    flex: 1,
    gap: 2,
  },
  txDesc: {
    fontSize: FontSize.body,
    fontWeight: Font.medium,
    color: colors.text,
  },
  txDate: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: Font.bold,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },

  // Load more
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: Gap.base,
    marginTop: Gap.sm,
  },
  loadMoreText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.primary,
  },

  // Empty
  emptyWrapper: {
    paddingTop: Gap.xl,
    paddingHorizontal: Gap.base,
  },
});
