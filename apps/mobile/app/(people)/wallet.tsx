import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import type { WalletBalance, CoinTransaction } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow } from '../../src/constants/theme';
import { EmptyState, LoadingScreen } from '../../src/components/common';
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
    const result = await api.coins.getWalletBalance(user.id);
    if (result.data) setBalance(result.data);
  }, [user]);

  const loadTransactions = useCallback(
    async (pageNum: number, append: boolean) => {
      if (!user) return;
      const result = await api.coins.getTransactionHistory(user.id, pageNum, 20);
      if (result.data) {
        const items = result.data.data ?? [];
        setTransactions((prev) => (append ? [...prev, ...items] : items));
        setHasMore(pageNum < result.data.total_pages);
      }
    },
    [user]
  );

  const initialLoad = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadBalance(), loadTransactions(1, false)]);
    setPage(1);
    setLoading(false);
  }, [loadBalance, loadTransactions]);

  useEffect(() => {
    initialLoad();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadBalance(), loadTransactions(1, false)]);
    setPage(1);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    await loadTransactions(next, true);
    setPage(next);
    setLoadingMore(false);
  };

  if (loading) return <LoadingScreen />;

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
            <Text style={styles.txDate}>
              {new Date(item.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </Text>
          </View>
          <Text style={[styles.txAmount, { color: pos ? colors.success : colors.error }]}>
            {pos ? '+' : '-'}{Math.abs(item.amount)}
          </Text>
        </View>
        {index < transactions.length - 1 && <View style={styles.separator} />}
      </View>
    );
  };

  const header = (
    <View>
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
        {loadingMore ? 'Loading…' : 'Load more'}
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
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
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
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
    gap: 0,
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

  // Transaction row
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Gap.base,
    paddingVertical: 14,
    backgroundColor: colors.surface,
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
    marginHorizontal: Gap.base,
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
