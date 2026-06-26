import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import type { Ambassador, User } from '@upshot/types';
import { colors, spacing, radius, shadow } from '../../src/constants/theme';
import {
  AvatarCircle,
  Badge,
  EmptyState,
  LoadingScreen,
  RoleTag,
} from '../../src/components/common';

const api = createApiClient();

type ActiveTab = 'workforce' | 'ambassadors';

const TIER_COLORS: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#9CA3AF',
  gold: '#F59E0B',
  platinum: '#8B5CF6',
};

export default function AdminPeople() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workforce');
  const [workforce, setWorkforce] = useState<User[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkforce = useCallback(async () => {
    const { data } = await api.supabase
      .from('profiles')
      .select('*')
      .in('role', ['people', 'student', 'ambassador'])
      .order('created_at', { ascending: false });
    if (data) setWorkforce(data as User[]);
  }, []);

  const loadAmbassadors = useCallback(async () => {
    const result = await api.ambassadors.getAllAmbassadors();
    if (result.data) setAmbassadors(result.data);
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadWorkforce(), loadAmbassadors()]);
  }, [loadWorkforce, loadAmbassadors]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadAll();
      setLoading(false);
    })();
  }, [loadAll]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }, [loadAll]);

  const handleIssueCode = useCallback(() => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Issue Ambassador Code',
        'Enter user email',
        async (email) => {
          if (!email) return;
          const { data: profile } = await api.supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
          if (!profile) {
            Alert.alert('Not found', 'No user with that email');
            return;
          }
          const result = await api.ambassadors.createAmbassador(profile.id, profile.full_name);
          if (result.error) {
            Alert.alert('Error', result.error.message);
          } else {
            Alert.alert('Success', 'Ambassador created!');
            await loadAmbassadors();
          }
        },
        'plain-text',
      );
    } else {
      Alert.alert(
        'Issue Ambassador Code',
        'This feature requires iOS prompt. Please use the web admin panel to issue ambassador codes.',
      );
    }
  }, [loadAmbassadors]);

  const filteredWorkforce = workforce.filter((u) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      (u.full_name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q)
    );
  });

  const filteredAmbassadors = ambassadors.filter((a) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const name = (a as any).user?.full_name ?? '';
    return (
      name.toLowerCase().includes(q) ||
      (a.referral_code ?? '').toLowerCase().includes(q)
    );
  });

  const renderWorkforceItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.personRow}
      activeOpacity={0.75}
      onPress={() =>
        Alert.alert(item.full_name ?? 'User', `Email: ${item.email}\nRole: ${item.role}`)
      }
    >
      <AvatarCircle name={item.full_name ?? '?'} size={40} />
      <View style={styles.personInfo}>
        <View style={styles.personNameRow}>
          <Text style={styles.personName}>{item.full_name ?? 'Unknown'}</Text>
          <RoleTag role={item.role} />
        </View>
        <Text style={styles.personEmail} numberOfLines={1}>
          {item.email}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderAmbassadorItem = ({ item }: { item: Ambassador }) => {
    const ambUser = (item as any).user;
    const name = ambUser?.full_name ?? 'Unknown';
    const tierColor = TIER_COLORS[item.tier] ?? colors.textSecondary;

    return (
      <View style={styles.personRow}>
        <AvatarCircle name={name} size={40} />
        <View style={styles.personInfo}>
          <View style={styles.personNameRow}>
            <Text style={styles.personName}>{name}</Text>
            <Badge
              label={item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}
              color={tierColor}
            />
          </View>
          <Text style={[styles.personEmail, { fontFamily: 'monospace' }]}>{item.referral_code}</Text>
          <Text style={styles.personSubMeta}>
            {item.referral_count} referrals · {item.total_coins_earned} coins
          </Text>
        </View>
      </View>
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Tab Toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'workforce' && styles.tabPillActive]}
          onPress={() => { setActiveTab('workforce'); setSearch(''); }}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabPillText, activeTab === 'workforce' && styles.tabPillTextActive]}>
            Workforce
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'ambassadors' && styles.tabPillActive]}
          onPress={() => { setActiveTab('ambassadors'); setSearch(''); }}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabPillText, activeTab === 'ambassadors' && styles.tabPillTextActive]}>
            Ambassadors
          </Text>
        </TouchableOpacity>
        {activeTab === 'ambassadors' && (
          <TouchableOpacity style={styles.issueBtn} onPress={handleIssueCode} activeOpacity={0.75}>
            <Text style={styles.issueBtnText}>Issue Code</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={activeTab === 'workforce' ? 'Search by name or email...' : 'Search ambassadors...'}
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      {/* List */}
      {activeTab === 'workforce' ? (
        <FlatList
          data={filteredWorkforce}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkforceItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState title="No people found" subtitle="No users match your search" />
          }
        />
      ) : (
        <FlatList
          data={filteredAmbassadors}
          keyExtractor={(item) => item.id}
          renderItem={renderAmbassadorItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState
              title="No ambassadors yet"
              subtitle="Use 'Issue Code' to create an ambassador"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  tabPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  tabPillActive: {
    backgroundColor: colors.primary,
  },
  tabPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabPillTextActive: {
    color: colors.surface,
  },
  issueBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  issueBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.surface,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
    ...shadow.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  personInfo: {
    flex: 1,
  },
  personNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  personName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  personEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  personSubMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
});
