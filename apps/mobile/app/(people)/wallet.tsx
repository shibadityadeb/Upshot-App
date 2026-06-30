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
import { createApiClient } from '@upshot/api-client';
import type { WalletBalance, CoinTransaction } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import { Badge, CoinBadge, Divider, EmptyState } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

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
  const user = useAuthStore((s) => s.user);

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

  const renderItem = ({ item, index }: { item: CoinTransaction; index: number }) => {
    const pos = isPositive(item.type);
    return (
      <View>
        <View style={styles.txRow}>
          <View style={styles.txIconBubble}>
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
        {index < transactions.length - 1 && <Divider />}
      </View>
    );
  };

  const header = (
    <View>
      {/* Balance card */}
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceLabel}>YOUR REWARDS</Text>
        <Text style={styles.balanceAmount}>{balance?.current_balance ?? 0}</Text>
        <Text style={styles.balanceUnit}>coins available</Text>
        <CoinBadge amount={balance?.current_balance ?? 0} />
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

      {transactions.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
        </View>
      )}
    </View>
  );

  const footer = hasMore ? (
    <TouchableOpacity
      style={styles.loadMoreBtn}
      onPress={handleLoadMore}
      disabled={loadingMore}
      activeOpacity={0.7}
    >
      <Text style={styles.loadMoreText}>
        {loadingMore ? 'Loading...' : 'Load more'}
      </Text>
    </TouchableOpacity>
  ) : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
              subtitle="Complete assignments to earn coins"
            />
          </View>
        }
        contentContainerStyle={styles.listContent}
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
  balanceHeader: {
    backgroundColor: colors.dark,
    paddingTop: Gap.lg,
    paddingBottom: Gap.xl,
    paddingHorizontal: Gap.base,
    alignItems: 'center',
    gap: Gap.sm,
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
    color: colors.surface,
    marginTop: Gap.sm,
    letterSpacing: -1,
  },
  balanceUnit: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
    marginBottom: Gap.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Gap.lg,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.lg,
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
    color: colors.surface,
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
  sectionHeader: {
    backgroundColor: colors.surface,
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
    paddingBottom: Gap.md,
  },
  sectionTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.bold,
    color: colors.text,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
    backgroundColor: colors.surface,
    gap: Gap.md,
  },
  txIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconText: {
    fontSize: 18,
  },
  txMid: {
    flex: 1,
    gap: 4,
  },
  txDesc: {
    fontSize: FontSize.body,
    fontWeight: Font.medium,
    color: colors.text,
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
  },
  txDate: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
  },
  txAmount: {
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
  },
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: Gap.base,
  },
  loadMoreText: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.primary,
  },
  emptyWrapper: {
    paddingTop: Gap.xl,
    paddingHorizontal: Gap.base,
  },
});
