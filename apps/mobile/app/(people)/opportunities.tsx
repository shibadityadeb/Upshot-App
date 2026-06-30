import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createApiClient } from '@upshot/api-client';
import type { Event } from '@upshot/types';
import { colors, Font, FontSize, Gap } from '../../src/constants/theme';
import { EmptyState, FilterPills, Input, OpportunityCard } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { useDebounce } from '../../src/hooks/useDebounce';

const api = createApiClient();

const CATEGORIES = ['All', 'Tech', 'Marketing', 'Design', 'Finance', 'Operations'];

export default function PeopleOpportunities() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [events, setEvents] = useState<Event[]>([]);
  const [appliedEventIds, setAppliedEventIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search);

  const loadApplications = useCallback(async () => {
    if (!user) return;
    try {
      const result = await api.events.getMyApplications(user.id);
      if (result.data) {
        setAppliedEventIds(new Set(result.data.map((a) => a.event_id)));
      }
    } catch (e) {
      console.warn(e);
    }
  }, [user]);

  const loadEvents = useCallback(async (category: string) => {
    try {
      const cat = category === 'All' ? undefined : category.toLowerCase();
      const result = await api.events.getApprovedEvents(1, 20, cat);
      if (result.data) {
        setEvents(result.data.data ?? result.data as any);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadEvents(selectedCategory), loadApplications()]);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadEvents(selectedCategory), loadApplications()]);
  }, [selectedCategory, loadEvents, loadApplications]);

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setLoading(true);
    loadEvents(cat);
  }, [loadEvents]);

  const filteredEvents = events.filter((e) => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return true;
    return e.title.toLowerCase().includes(q) || (e.location ?? '').toLowerCase().includes(q);
  });

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.cardWrapper}>
      <OpportunityCard
        event={item as any}
        onPress={() => router.push(`/(people)/apply/${item.id}` as any)}
        onApply={() => router.push(`/(people)/apply/${item.id}` as any)}
        hasApplied={appliedEventIds.has(item.id)}
        isApplying={applyingIds.has(item.id)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Dark header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Opportunities</Text>
        <Text style={styles.headerSubtitle}>Find your next activation</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search opportunities..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Category filter pills */}
      <FilterPills
        options={CATEGORIES.map(cat => ({ label: cat, value: cat }))}
        activeValue={selectedCategory}
        onChange={handleCategoryChange}
      />

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="briefcase-outline"
            title={debouncedSearch ? 'No results found' : 'No opportunities found'}
            subtitle={
              debouncedSearch
                ? 'Try a different search term'
                : 'Check back later or try a different category'
            }
          />
        }
      />
    </SafeAreaView>
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
  header: {
    backgroundColor: colors.dark,
    paddingTop: Gap.lg,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.lg,
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: colors.surface,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: Gap.xs,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.sm,
    paddingBottom: 100,
    flexGrow: 1,
  },
  cardWrapper: {
    marginBottom: Gap.sm,
  },
});
