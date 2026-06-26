import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import type { Event } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import { Button, EmptyState, LoadingScreen, OpportunityCard } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

const CATEGORIES = ['All', 'Society', 'BFSI', 'Retail', 'Mall', 'Campus', 'Corporate', 'Other'];

export default function PeopleOpportunities() {
  const user = useAuthStore((s) => s.user);

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [appliedEventIds, setAppliedEventIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((e) => e.title.toLowerCase().includes(q)));
    }
  }, [events, searchQuery]);

  const loadApplications = useCallback(async () => {
    if (!user) return;
    const result = await api.events.getMyApplications(user.id);
    if (result.data) {
      setAppliedEventIds(new Set(result.data.map((a) => a.event_id)));
    }
  }, [user]);

  const loadEvents = useCallback(
    async (pageNum: number, category: string, append: boolean) => {
      if (!append) setLoading(true);
      const cat = category === 'All' ? undefined : category.toLowerCase();
      const result = await api.events.getApprovedEvents(pageNum, 10, cat);
      if (result.data) {
        const newEvents = result.data.data;
        setEvents((prev) => (append ? [...prev, ...newEvents] : newEvents));
        setHasMore(pageNum < result.data.total_pages);
      }
      if (!append) setLoading(false);
    },
    []
  );

  useEffect(() => {
    loadEvents(1, selectedCategory, false);
    loadApplications();
  }, []);

  useEffect(() => {
    if (page > 1) {
      loadEvents(page, selectedCategory, true);
    }
  }, [page]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
    setSearchQuery('');
    loadEvents(1, cat, false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setSearchQuery('');
    await Promise.all([loadEvents(1, selectedCategory, false), loadApplications()]);
    setRefreshing(false);
  };

  const handleApply = async (eventId: string) => {
    if (!user) return;
    setApplyingIds((prev) => new Set(prev).add(eventId));
    const result = await api.events.applyForEvent(eventId, user.id);
    if (result.error) {
      Alert.alert('Error', result.error.message);
    } else {
      setAppliedEventIds((prev) => new Set(prev).add(eventId));
      Alert.alert('Applied!', 'Your application has been submitted.');
    }
    setApplyingIds((prev) => {
      const s = new Set(prev);
      s.delete(eventId);
      return s;
    });
  };

  const renderEventCard = ({ item: event }: { item: Event }) => (
    <View style={styles.cardWrapper}>
      <OpportunityCard
        event={event as any}
        onPress={() => void 0}
        onApply={() => handleApply(event.id)}
        hasApplied={appliedEventIds.has(event.id)}
        isApplying={applyingIds.has(event.id)}
      />
    </View>
  );

  const renderFooter = () => {
    if (!hasMore || loading) return null;
    return (
      <View style={styles.loadMoreContainer}>
        <Button
          title="Load more"
          onPress={() => setPage((p) => p + 1)}
          variant="outline"
          size="sm"
        />
      </View>
    );
  };

  if (loading && events.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Dark header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Opportunities</Text>
        <Text style={styles.headerSubtitle}>Find your next activation</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search opportunities..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        style={styles.categoryScrollWrapper}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
              onPress={() => handleCategoryChange(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {searchQuery.trim().length > 0 && (
        <Text style={styles.resultsCount}>
          {filteredEvents.length} {filteredEvents.length === 1 ? 'result' : 'results'} for "{searchQuery.trim()}"
        </Text>
      )}

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEventCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title={searchQuery.trim() ? 'No results found' : 'No opportunities found'}
              subtitle={
                searchQuery.trim()
                  ? 'Try a different search term'
                  : 'Check back later or try a different category'
              }
            />
          ) : null
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
  header: {
    backgroundColor: colors.dark,
    paddingTop: 20,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.lg,
  },
  headerTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.black,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  searchContainer: {
    marginHorizontal: Gap.base,
    marginTop: Gap.md,
    marginBottom: Gap.xs,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: Gap.base,
    paddingVertical: 10,
    fontSize: FontSize.body,
    color: colors.text,
  },
  categoryScrollWrapper: {
    maxHeight: 52,
  },
  categoryScroll: {
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.sm,
    gap: Gap.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
  },
  categoryPillText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  resultsCount: {
    fontSize: FontSize.xs,
    color: colors.textSecondary,
    paddingHorizontal: Gap.base,
    marginBottom: Gap.xs,
  },
  listContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.sm,
    paddingBottom: 100,
    flexGrow: 1,
  },
  cardWrapper: {
    marginBottom: 10,
  },
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: Gap.base,
  },
});
