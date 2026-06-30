import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Ambassador } from '@upshot/types';
import { colors, DarkBg, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import {
  AvatarCircle,
  Badge,
  Divider,
  EmptyState,
  FilterPills,
  RoleTag,
} from '../../src/components/common';
import { AmbassadorCodesPanel } from '../../src/screens/admin/AmbassadorCodesPanel';
import { useAuthStore } from '../../src/store/auth.store';
import { useDebounce } from '../../src/hooks/useDebounce';

const api = createApiClient();

type ActiveTab = 'all' | 'ambassadors' | 'codes';

const TABS: { key: ActiveTab; label: string }[] = [
  { key: 'all', label: 'People' },
  { key: 'ambassadors', label: 'Ambassadors' },
  { key: 'codes', label: 'Codes' },
];

const TIER_COLORS: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#9CA3AF',
  gold: '#F59E0B',
  platinum: '#8B5CF6',
};

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function AdminPeople() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const debouncedSearch = useDebounce(search);

  const loadProfiles = useCallback(async () => {
    try {
      const { data } = await (api as any).supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['people', 'student', 'ambassador', 'admin'])
        .order('created_at', { ascending: false });
      if (data) setProfiles(data as Profile[]);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const loadAmbassadors = useCallback(async () => {
    try {
      const result = await api.ambassadors.getAllAmbassadors();
      if (result.data) setAmbassadors(result.data);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadProfiles(), loadAmbassadors()]);
    setLoading(false);
    setRefreshing(false);
  }, [loadProfiles, loadAmbassadors]);

  useEffect(() => {
    setLoading(true);
    loadAll();
  }, [loadAll]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAll();
  }, [loadAll]);

  const filteredProfiles = profiles.filter((p) => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return true;
    return (
      (p.full_name ?? '').toLowerCase().includes(q) ||
      (p.email ?? '').toLowerCase().includes(q)
    );
  });

  const filteredAmbassadors = ambassadors.filter((a) => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return true;
    const name = (a as any).user?.full_name ?? (a as any).profile?.full_name ?? '';
    return (
      name.toLowerCase().includes(q) ||
      (a.referral_code ?? '').toLowerCase().includes(q)
    );
  });

  const renderProfile = ({ item }: { item: Profile }) => (
    <TouchableOpacity
      style={styles.personRow}
      activeOpacity={0.75}
      onPress={() => router.push(`/(admin)/person-detail/${item.id}` as any)}
    >
      <AvatarCircle name={item.full_name ?? '?'} size={42} />
      <View style={styles.personInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.personName} numberOfLines={1}>{item.full_name ?? 'Unknown'}</Text>
          <RoleTag role={item.role} />
        </View>
        <Text style={styles.personEmail} numberOfLines={1}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAmbassador = ({ item }: { item: Ambassador }) => {
    const ambUser = (item as any).user ?? (item as any).profile;
    const name = ambUser?.full_name ?? 'Unknown';
    const tierColor = TIER_COLORS[item.tier] ?? colors.textSecondary;

    return (
      <TouchableOpacity
        style={styles.personRow}
        activeOpacity={0.75}
        onPress={() => {
          const userId = item.user_id ?? (item as any).user?.id ?? item.id;
          router.push(`/(admin)/person-detail/${userId}` as any);
        }}
      >
        <AvatarCircle name={name} size={42} />
        <View style={styles.personInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.personName} numberOfLines={1}>{name}</Text>
            <Badge
              label={item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}
              color={tierColor}
            />
          </View>
          <Text style={styles.personEmail} numberOfLines={1}>
            {item.referral_code} · {item.referral_count} referrals
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Dark hero header */}
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroTitle}>People</Text>
            <Text style={styles.heroSub}>{profiles.length} members</Text>
          </View>
        </View>

        {/* Search — hidden on Codes tab */}
        {activeTab !== 'codes' && (
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.5)" />
            <TextInput
              placeholder="Search by name or email..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
        )}
      </View>

      {/* Tabs */}
      <FilterPills
        options={TABS.map(t => ({ label: t.label, value: t.key }))}
        activeValue={activeTab}
        onChange={(v) => { setActiveTab(v as ActiveTab); setSearch(''); }}
      />

      {/* List / Panel */}
      {activeTab === 'all' ? (
        <FlatList
          data={filteredProfiles}
          keyExtractor={(item) => item.id}
          renderItem={renderProfile}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={
            <EmptyState
              iconName="people-outline"
              title="No people found"
              subtitle={debouncedSearch ? 'Try a different search term' : 'No users yet'}
            />
          }
        />
      ) : activeTab === 'ambassadors' ? (
        <FlatList
          data={filteredAmbassadors}
          keyExtractor={(item) => item.id}
          renderItem={renderAmbassador}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={
            <EmptyState
              iconName="ribbon-outline"
              title="No ambassadors yet"
              subtitle="Create ambassadors from person detail"
            />
          }
        />
      ) : (
        /* Codes tab — inline AmbassadorCodesPanel */
        user ? (
          <AmbassadorCodesPanel adminId={user.id} />
        ) : null
      )}
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
    backgroundColor: DarkBg,
    paddingHorizontal: Gap.base,
    paddingTop: 32,
    paddingBottom: 20,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    gap: 8,
    height: 42,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: FontSize.body,
    height: 42,
  },
  listContent: {
    paddingBottom: Gap.xl,
    flexGrow: 1,
    backgroundColor: colors.surface,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Gap.md,
    paddingHorizontal: Gap.base,
    backgroundColor: colors.surface,
    gap: Gap.md,
  },
  personInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.xs,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  personName: {
    fontSize: FontSize.body,
    fontWeight: Font.semibold,
    color: colors.text,
    flexShrink: 1,
  },
  personEmail: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
  },
});
