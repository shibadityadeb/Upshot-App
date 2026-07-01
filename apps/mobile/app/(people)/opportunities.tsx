import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { Event } from '@upshot/types';
import { colors, Font, FontSize, Gap } from '../../src/constants/theme';
import { EmptyState, OpportunityCard } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { useDebounce } from '../../src/hooks/useDebounce';

const api = createApiClient();

const CATEGORIES = ['All', 'Social', 'BFSI', 'Corporate', 'Other'];

export default function PeopleOpportunities() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();

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
    <View style={styles.container}>
      {/* Dark header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Opportunities</Text>
            <Text style={styles.headerSubtitle}>Find your next project</Text>
          </View>
          <TouchableOpacity
            style={styles.hostBtn}
            onPress={() => router.push('/(people)/host-event' as any)}
            activeOpacity={0.75}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
            <Text style={styles.hostBtnText}>Host</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search + Category pills — single white block */}
      <View style={styles.filterBlock}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search opportunities..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => handleCategoryChange(cat)}
                activeOpacity={0.75}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="briefcase-outline"
            title={debouncedSearch ? 'No results found' : 'No opportunities right now'}
            subtitle={
              debouncedSearch
                ? 'Try a different search term'
                : 'New projects are posted regularly.\nCheck back soon.'
            }
          />
        }
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
  header: {
    backgroundColor: colors.dark,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  hostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  hostBtnText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: '#fff',
  },
  filterBlock: {
    backgroundColor: colors.surface,
    paddingHorizontal: Gap.base,
    paddingTop: 10,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    fontSize: FontSize.body,
    color: colors.text,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 40,
  },
  pillRow: {
    paddingVertical: 10,
    gap: Gap.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  pillLabelActive: {
    color: colors.surface,
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
