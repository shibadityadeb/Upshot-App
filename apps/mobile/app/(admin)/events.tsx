import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
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
import type { Event, HostingApplication, Vertical } from '@upshot/types';
import { colors, DarkBg, Font, FontSize, Gap, radius, shadow, verticalColors } from '../../src/constants/theme';
import {
  Button,
  Card,
  CoinBadge,
  EmptyState,
  FilterPills,
  StatusBadge,
} from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';
import { useDebounce } from '../../src/hooks/useDebounce';

const api = createApiClient();

interface VerticalOption {
  id: string | null;
  slug?: string;
  name: string;
  color: string;
  accent: string;
}

const STATIC_VERTICAL_OPTIONS: VerticalOption[] = [
  { id: null, name: 'None', color: colors.border, accent: colors.textSecondary },
  { id: 'unfiltered', slug: 'unfiltered', name: 'Unfiltered', color: verticalColors.unfiltered + '20', accent: verticalColors.unfiltered },
  { id: 'campus-cartel', slug: 'campus-cartel', name: 'Campus Cartel', color: verticalColors.campusCartel + '20', accent: verticalColors.campusCartel },
  { id: 'irise', slug: 'irise', name: 'iRISE', color: verticalColors.irise + '20', accent: verticalColors.irise },
  { id: 'ibelieve', slug: 'ibelieve', name: 'iBelieve', color: verticalColors.ibelieve + '20', accent: verticalColors.ibelieve },
];

type FilterOption = 'all' | 'pending' | 'approved' | 'rejected';

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

type TabKey = 'events' | 'hosting';

export default function AdminEvents() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<TabKey>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Host Applications
  const [hostApps, setHostApps] = useState<HostingApplication[]>([]);
  const [hostFilter, setHostFilter] = useState<FilterOption>('all');
  const [hostLoading, setHostLoading] = useState(false);
  const [hostActionLoading, setHostActionLoading] = useState<string | null>(null);

  // Approve modal
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [pendingApproveEventId, setPendingApproveEventId] = useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] = useState<VerticalOption>(STATIC_VERTICAL_OPTIONS[0]);
  const [verticalOptions, setVerticalOptions] = useState<VerticalOption[]>(STATIC_VERTICAL_OPTIONS);
  const [approving, setApproving] = useState(false);

  // Change vertical modal
  const [changeVerticalModalVisible, setChangeVerticalModalVisible] = useState(false);
  const [pendingChangeEventId, setPendingChangeEventId] = useState<string | null>(null);
  const [changeSelectedVertical, setChangeSelectedVertical] = useState<VerticalOption>(STATIC_VERTICAL_OPTIONS[0]);

  const debouncedSearch = useDebounce(search);

  // Load real vertical UUIDs from DB
  useEffect(() => {
    (async () => {
      try {
        const { data } = await (api as any).supabase.from('verticals').select('id, name, slug, color');
        if (data && data.length > 0) {
          const mapped: VerticalOption[] = [
            { id: null, name: 'None', color: colors.border, accent: colors.textSecondary },
            ...STATIC_VERTICAL_OPTIONS.slice(1).map((opt) => {
              const dbV = (data as Vertical[]).find((v) => v.slug === opt.slug);
              return { ...opt, id: dbV ? dbV.id : opt.id };
            }),
          ];
          setVerticalOptions(mapped);
        }
      } catch (e) {
        console.warn('Failed to load verticals', e);
      }
    })();
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const result = await api.events.getAllEventsAdmin();
      if (result.data) {
        setEvents(result.data);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadHostApps = useCallback(async () => {
    setHostLoading(true);
    try {
      const result = await api.hosting.getAllApplicationsAdmin();
      if (result.data) setHostApps(result.data);
    } catch (e) {
      console.warn(e);
    } finally {
      setHostLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadEvents();
    loadHostApps();
  }, [loadEvents, loadHostApps]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents();
    loadHostApps();
  }, [loadEvents, loadHostApps]);

  const filteredEvents = events.filter((e) => {
    const matchesFilter = filter === 'all' || e.status === filter;
    const q = debouncedSearch.toLowerCase();
    const matchesSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      ((e as any).venue ?? '').toLowerCase().includes(q) ||
      ((e as any).city ?? '').toLowerCase().includes(q) ||
      (e.location ?? '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleApprovePress = useCallback((eventId: string) => {
    setPendingApproveEventId(eventId);
    setSelectedVertical(verticalOptions[0]);
    setApproveModalVisible(true);
  }, [verticalOptions]);

  const handleConfirmApproval = useCallback(async () => {
    if (!user || !pendingApproveEventId) return;
    setApproving(true);
    try {
      const result = await api.events.updateEventStatus(pendingApproveEventId, user.id, {
        status: 'approved',
      });
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        if (selectedVertical.id) {
          try {
            await api.events.updateEventVertical(pendingApproveEventId, selectedVertical.id);
          } catch (e) {
            console.warn('Failed to assign vertical', e);
          }
        }
        setApproveModalVisible(false);
        setPendingApproveEventId(null);
        await loadEvents();
      }
    } finally {
      setApproving(false);
    }
  }, [user, pendingApproveEventId, selectedVertical, loadEvents]);

  const handleChangeVerticalPress = useCallback((eventId: string, currentVerticalId: string | null) => {
    setPendingChangeEventId(eventId);
    const current = verticalOptions.find((v) => v.id === currentVerticalId) ?? verticalOptions[0];
    setChangeSelectedVertical(current);
    setChangeVerticalModalVisible(true);
  }, [verticalOptions]);

  const handleConfirmChangeVertical = useCallback(async () => {
    if (!pendingChangeEventId) return;
    setActionLoading(pendingChangeEventId);
    try {
      await api.events.updateEventVertical(pendingChangeEventId, changeSelectedVertical.id);
      setChangeVerticalModalVisible(false);
      setPendingChangeEventId(null);
      await loadEvents();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to update vertical');
    } finally {
      setActionLoading(null);
    }
  }, [pendingChangeEventId, changeSelectedVertical, loadEvents]);

  const handleReject = useCallback(
    (eventId: string) => {
      if (!user) return;
      if (Platform.OS === 'ios') {
        Alert.prompt(
          'Rejection Reason',
          'Enter reason (optional)',
          async (reason) => {
            setActionLoading(eventId);
            try {
              const result = await api.events.updateEventStatus(eventId, user.id, {
                status: 'rejected',
                rejection_reason: reason || 'Rejected by admin',
              });
              if (result.error) {
                Alert.alert('Error', result.error.message);
              } else {
                await loadEvents();
              }
            } finally {
              setActionLoading(null);
            }
          },
          'plain-text',
        );
      } else {
        Alert.alert('Reject Event', 'This event will be rejected.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: async () => {
              setActionLoading(eventId);
              try {
                await api.events.updateEventStatus(eventId, user.id, {
                  status: 'rejected',
                  rejection_reason: 'Rejected by admin',
                });
                await loadEvents();
              } finally {
                setActionLoading(null);
              }
            },
          },
        ]);
      }
    },
    [user, loadEvents],
  );

  const filteredHostApps = hostApps.filter((a) => hostFilter === 'all' || a.status === hostFilter);

  const handleHostApprove = useCallback(async (appId: string) => {
    if (!user) return;
    setHostActionLoading(appId);
    try {
      const result = await api.hosting.approveApplication(appId, user.id);
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        Alert.alert('Approved', 'Event has been created from this application.');
        await Promise.all([loadHostApps(), loadEvents()]);
      }
    } finally {
      setHostActionLoading(null);
    }
  }, [user, loadHostApps, loadEvents]);

  const handleHostReject = useCallback((appId: string) => {
    if (!user) return;
    if (Platform.OS === 'ios') {
      Alert.prompt('Rejection Reason', 'Enter reason (optional)', async (reason) => {
        setHostActionLoading(appId);
        try {
          const result = await api.hosting.rejectApplication(appId, user.id, reason || undefined);
          if (result.error) Alert.alert('Error', result.error.message);
          else await loadHostApps();
        } finally {
          setHostActionLoading(null);
        }
      }, 'plain-text');
    } else {
      Alert.alert('Reject Application', 'This hosting application will be rejected.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject', style: 'destructive',
          onPress: async () => {
            setHostActionLoading(appId);
            try {
              await api.hosting.rejectApplication(appId, user.id, 'Rejected by admin');
              await loadHostApps();
            } finally {
              setHostActionLoading(null);
            }
          },
        },
      ]);
    }
  }, [user, loadHostApps]);

  const renderHostApp = ({ item }: { item: HostingApplication }) => {
    const isPending = item.status === 'pending';
    const isActioning = hostActionLoading === item.id;
    const appDate = new Date(item.event_date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
    const applicant = (item as any).user;

    return (
      <Card style={styles.eventCard}>
        {!!item.cover_image_url && (
          <Image
            source={{ uri: item.cover_image_url }}
            style={styles.hostCoverImg}
            resizeMode="cover"
          />
        )}
        <View style={styles.hostCardBody}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
            <StatusBadge status={item.status} />
          </View>
          {applicant && (
            <Text style={styles.hostApplicant}>
              by {applicant.full_name ?? applicant.email}
            </Text>
          )}
          <Text style={styles.eventMeta}>{appDate} · {item.location}</Text>
          {!!item.description && (
            <Text style={styles.hostDesc} numberOfLines={2}>{item.description}</Text>
          )}
          <View style={styles.footerRow}>
            <CoinBadge amount={item.coin_reward} />
            {!!item.max_attendees && (
              <View style={styles.capacityBadge}>
                <Text style={styles.capacityText}>{item.max_attendees} spots</Text>
              </View>
            )}
          </View>
          {isPending && (
            <View style={styles.actionRow}>
              <Button
                title="Approve"
                variant="primary"
                size="sm"
                style={styles.actionBtn}
                onPress={() => handleHostApprove(item.id)}
                disabled={isActioning}
                loading={isActioning}
              />
              <Button
                title="Reject"
                variant="outline"
                size="sm"
                style={[styles.actionBtn, styles.rejectBtn]}
                onPress={() => handleHostReject(item.id)}
                disabled={isActioning}
              />
            </View>
          )}
          {item.status === 'rejected' && !!item.rejection_reason && (
            <Text style={styles.rejectionReason}>Reason: {item.rejection_reason}</Text>
          )}
        </View>
      </Card>
    );
  };

  const renderEvent = ({ item }: { item: Event }) => {
    const isPending = item.status === 'pending';
    const isApproved = item.status === 'approved';
    const isActioning = actionLoading === item.id;
    const eventDate = new Date(item.event_date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const venue = (item as any).venue;
    const city = (item as any).city;
    const locationLine = venue ? `${venue}${city ? ', ' + city : ''}` : (item.location ?? '');
    const eventVertical = verticalOptions.find((v) => v.id === item.vertical_id);

    return (
      <Card
        style={styles.eventCard}
        onPress={() => router.push(`/(admin)/event-detail/${item.id}` as any)}
      >
        <View style={styles.eventRow}>
          {!!item.banner_url && (
            <Image
              source={{ uri: item.banner_url }}
              style={styles.eventThumb}
              resizeMode="cover"
            />
          )}
          <View style={styles.eventInfo}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <StatusBadge status={item.status} />
        </View>

        <Text style={styles.eventMeta}>{eventDate}</Text>

        {!!locationLine && (
          <Text style={styles.eventLocation} numberOfLines={1}>
            {locationLine}
          </Text>
        )}

        {eventVertical && eventVertical.id && (
          <View style={[styles.verticalChip, { backgroundColor: eventVertical.color }]}>
            <Text style={[styles.verticalChipText, { color: eventVertical.accent }]}>
              {eventVertical.name}
            </Text>
          </View>
        )}

        <View style={styles.footerRow}>
          <CoinBadge amount={item.coin_reward} />
          {!!(item as any).max_attendees && (
            <View style={styles.capacityBadge}>
              <Text style={styles.capacityText}>
                {(item as any).current_attendees ?? 0}/{(item as any).max_attendees} spots
              </Text>
            </View>
          )}
        </View>

        {isPending && (
          <View style={styles.actionRow}>
            <Button
              title="Approve"
              variant="primary"
              size="sm"
              style={styles.actionBtn}
              onPress={() => handleApprovePress(item.id)}
              disabled={isActioning}
              loading={isActioning}
            />
            <Button
              title="Reject"
              variant="outline"
              size="sm"
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(item.id)}
              disabled={isActioning}
            />
          </View>
        )}

        {isApproved && (
          <TouchableOpacity
            style={styles.changeVerticalLink}
            onPress={() => handleChangeVerticalPress(item.id, item.vertical_id)}
            activeOpacity={0.7}
          >
            <Text style={styles.changeVerticalLinkText}>
              {item.vertical_id ? 'Change vertical' : 'Assign vertical'}
            </Text>
          </TouchableOpacity>
        )}
          </View>
        </View>
      </Card>
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
            <Text style={styles.heroTitle}>Events</Text>
            <Text style={styles.heroSub}>{events.length} total</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(admin)/create-event' as any)}
            activeOpacity={0.75}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search inside hero */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.5)" />
          <TextInput
            placeholder="Search events..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.tabActive]}
          onPress={() => setActiveTab('events')}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={16} color={activeTab === 'events' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hosting' && styles.tabActive]}
          onPress={() => setActiveTab('hosting')}
          activeOpacity={0.7}
        >
          <Ionicons name="document-text-outline" size={16} color={activeTab === 'hosting' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'hosting' && styles.tabTextActive]}>Host Applications</Text>
          {hostApps.filter(a => a.status === 'pending').length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{hostApps.filter(a => a.status === 'pending').length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {activeTab === 'events' ? (
        <>
          {/* Filter Pills */}
          <FilterPills
            options={FILTER_OPTIONS.map(f => ({ label: f.label, value: f.key }))}
            activeValue={filter}
            onChange={(v) => setFilter(v as FilterOption)}
          />

          {/* Events List */}
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
              events.length === 0 ? (
                <EmptyState
                  iconName="document-text-outline"
                  title="No projects yet"
                  subtitle="Approved projects from companies will appear here"
                />
              ) : (
                <EmptyState
                  iconName="search-outline"
                  title="No matches"
                  subtitle="No events with this status right now"
                />
              )
            }
          />
        </>
      ) : (
        <>
          {/* Host Apps Filter */}
          <FilterPills
            options={FILTER_OPTIONS.map(f => ({ label: f.label, value: f.key }))}
            activeValue={hostFilter}
            onChange={(v) => setHostFilter(v as FilterOption)}
          />

          {hostLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={filteredHostApps}
              keyExtractor={(item) => item.id}
              renderItem={renderHostApp}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
              }
              ListEmptyComponent={
                <EmptyState
                  iconName="document-text-outline"
                  title="No hosting applications"
                  subtitle="When users submit event hosting requests, they'll appear here"
                />
              }
            />
          )}
        </>
      )}

      {/* Approve & Categorize Modal */}
      <Modal
        visible={approveModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => { setApproveModalVisible(false); setPendingApproveEventId(null); }}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Approve & Categorize</Text>
              <TouchableOpacity
                onPress={() => { setApproveModalVisible(false); setPendingApproveEventId(null); }}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Assign this project to a vertical (optional)</Text>

            <Text style={styles.sectionLabel}>Select Vertical</Text>
            <View style={styles.verticalPicker}>
              {verticalOptions.map((v) => (
                <TouchableOpacity
                  key={v.name}
                  style={[
                    styles.verticalPickerChip,
                    { backgroundColor: v.color },
                    selectedVertical.name === v.name && { borderWidth: 2, borderColor: v.accent },
                  ]}
                  onPress={() => setSelectedVertical(v)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.verticalPickerChipText, { color: v.accent }]}>{v.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Confirm Approval"
              onPress={handleConfirmApproval}
              loading={approving}
              disabled={approving}
              style={styles.modalBtn}
            />
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => { setApproveModalVisible(false); setPendingApproveEventId(null); }}
              style={styles.modalBtn}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Change Vertical Modal */}
      <Modal
        visible={changeVerticalModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => { setChangeVerticalModalVisible(false); setPendingChangeEventId(null); }}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Change Vertical</Text>
              <TouchableOpacity
                onPress={() => { setChangeVerticalModalVisible(false); setPendingChangeEventId(null); }}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Re-assign this event to a different vertical</Text>

            <Text style={styles.sectionLabel}>Select Vertical</Text>
            <View style={styles.verticalPicker}>
              {verticalOptions.map((v) => (
                <TouchableOpacity
                  key={v.name}
                  style={[
                    styles.verticalPickerChip,
                    { backgroundColor: v.color },
                    changeSelectedVertical.name === v.name && { borderWidth: 2, borderColor: v.accent },
                  ]}
                  onPress={() => setChangeSelectedVertical(v)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.verticalPickerChipText, { color: v.accent }]}>{v.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Save"
              onPress={handleConfirmChangeVertical}
              loading={actionLoading !== null}
              disabled={actionLoading !== null}
              style={styles.modalBtn}
            />
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => { setChangeVerticalModalVisible(false); setPendingChangeEventId(null); }}
              style={styles.modalBtn}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    marginBottom: 16,
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabBadge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: Font.bold,
    color: '#fff',
  },

  listContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: 80,
    flexGrow: 1,
  },
  eventCard: {
    marginBottom: Gap.sm,
    padding: 0,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.sm,
  },
  eventRow: {
    flexDirection: 'row',
  },
  eventThumb: {
    width: 80,
    height: '100%',
    minHeight: 80,
  },
  eventInfo: {
    flex: 1,
    padding: Gap.base,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Gap.sm,
    marginBottom: Gap.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: FontSize.h3,
    fontWeight: Font.bold,
    color: colors.text,
    lineHeight: 22,
  },
  eventMeta: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  eventLocation: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginBottom: Gap.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
    marginTop: Gap.xs,
  },
  capacityBadge: {
    backgroundColor: colors.info + '18',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  capacityText: {
    fontSize: FontSize.xs,
    color: colors.info,
    fontWeight: Font.semibold,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Gap.sm,
    marginTop: Gap.md,
  },
  actionBtn: {
    flex: 1,
  },
  rejectBtn: {
    borderColor: colors.error,
  },
  verticalChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: Gap.xs,
    marginBottom: Gap.xs,
  },
  verticalChipText: {
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
  },
  changeVerticalLink: {
    marginTop: Gap.sm,
    alignSelf: 'flex-start',
  },
  changeVerticalLinkText: {
    fontSize: FontSize.small,
    color: colors.primary,
    fontWeight: Font.semibold,
    textDecorationLine: 'underline',
  },
  // Modals
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContent: {
    padding: Gap.xl,
    paddingTop: Gap.xxl,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Gap.sm,
  },
  modalTitle: {
    fontSize: FontSize.h1,
    fontWeight: Font.bold,
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    marginBottom: Gap.lg,
  },
  sectionLabel: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.text,
    marginBottom: Gap.sm,
  },
  verticalPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.sm,
    marginBottom: Gap.lg,
  },
  verticalPickerChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  verticalPickerChipText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
  },
  modalBtn: {
    marginTop: Gap.sm,
  },
  // Host Applications
  hostCoverImg: {
    width: '100%',
    height: 180,
  },
  hostCardBody: {
    padding: Gap.base,
  },
  hostApplicant: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  hostDesc: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: Gap.xs,
  },
  rejectionReason: {
    fontSize: FontSize.xs,
    color: colors.error,
    marginTop: Gap.sm,
    fontStyle: 'italic',
  },
});
