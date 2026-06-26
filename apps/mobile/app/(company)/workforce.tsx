import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Switch,
  TouchableOpacity,
  Linking,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import { useAuthStore } from '../../src/store/auth.store';
import {
  colors,
  DarkBg,
  spacing,
  radius,
  shadow,
} from '../../src/constants/theme';
import {
  Input,
  Card,
  AvatarCircle,
  EmptyState,
  LoadingScreen,
} from '../../src/components/common';
import type { WorkforceProfile } from '@upshot/types';

const api = createApiClient();

function LockedCard() {
  return (
    <Card style={styles.lockedCard}>
      <View style={styles.lockedLine} />
      <View style={[styles.lockedLine, { width: '60%', marginTop: 10 }]} />
      <View style={[styles.lockedLine, { width: '40%', marginTop: 10 }]} />
    </Card>
  );
}

export default function WorkforceDiscover() {
  const user = useAuthStore((s) => s.user);
  const [workforce, setWorkforce] = useState<WorkforceProfile[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canDiscover, setCanDiscover] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: co } = await api.supabase
        .from('companies')
        .select('*')
        .eq('contact_person_id', user.id)
        .single();

      setCanDiscover(co?.can_discover_workforce ?? false);

      if (co?.can_discover_workforce) {
        try {
          const wf = await api.workforce.getAvailableWorkforce(cityFilter || undefined);
          setWorkforce(availableOnly ? wf.filter((w) => w.is_available) : wf);
        } catch {
          setWorkforce([]);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, cityFilter, availableOnly]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (loading) return <LoadingScreen />;

  const renderWorkerCard = ({ item }: { item: WorkforceProfile }) => (
    <Card style={styles.workerCard}>
      <View style={styles.workerRow}>
        <AvatarCircle name={item.user?.full_name ?? 'Worker'} size={44} />
        <View style={styles.workerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.workerName}>{item.user?.full_name ?? 'Unknown'}</Text>
            <View
              style={[
                styles.availDot,
                { backgroundColor: item.is_available ? colors.success : colors.border },
              ]}
            />
          </View>
          <Text style={styles.workerCity}>
            {item.city}{item.state ? `, ${item.state}` : ''}
          </Text>
          <Text style={styles.workerExp}>{item.experience_years} years experience</Text>
        </View>
      </View>

      {/* Skills */}
      {item.skills && item.skills.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.skillsRow}
        >
          {item.skills.map((skill, idx) => (
            <View key={`${skill}-${idx}`} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Bio */}
      {item.bio ? (
        <Text style={styles.workerBio} numberOfLines={2}>{item.bio}</Text>
      ) : null}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Dark editorial header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find talent</Text>
        <Text style={styles.headerSubtitle}>Browse UBM's verified on-ground workforce</Text>
      </View>

      {!canDiscover ? (
        <View style={styles.lockedContainer}>
          {/* Blurred placeholder cards */}
          <FlatList
            data={[0, 1, 2]}
            keyExtractor={(item) => String(item)}
            renderItem={() => <LockedCard />}
            scrollEnabled={false}
            contentContainerStyle={styles.lockedList}
          />

          {/* Overlay */}
          <View style={styles.lockOverlay}>
            <View style={styles.lockCard}>
              <Text style={styles.lockEmoji}>🔒</Text>
              <Text style={styles.lockTitle}>Unlock workforce discovery</Text>
              <Text style={styles.lockSubtitle}>
                Contact UBM to activate workforce discovery for your account
              </Text>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => Linking.openURL('mailto:contact@upshotbrandmedia.com')}
                activeOpacity={0.7}
              >
                <Text style={styles.contactEmail}>contact@upshotbrandmedia.com</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <>
          {/* Filter row */}
          <View style={styles.filterRow}>
            <Input
              placeholder="Filter by city..."
              value={cityFilter}
              onChangeText={setCityFilter}
              style={styles.cityInput}
            />
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Available</Text>
              <Switch
                value={availableOnly}
                onValueChange={setAvailableOnly}
                trackColor={{ true: colors.success, false: colors.border }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <FlatList
            data={workforce}
            keyExtractor={(item) => item.id}
            renderItem={renderWorkerCard}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                title="No workers found"
                subtitle={
                  cityFilter
                    ? `No available workers in ${cityFilter}. Try a different city.`
                    : 'No available workforce at the moment. Check back soon.'
                }
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: DarkBg,
    paddingTop: 52,
    paddingHorizontal: spacing.lg,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.accent,
    marginTop: 4,
  },
  // Locked state
  lockedContainer: {
    flex: 1,
    position: 'relative',
  },
  lockedList: {
    paddingTop: spacing.md,
  },
  lockedCard: {
    opacity: 0.3,
    marginHorizontal: spacing.md,
    marginBottom: 12,
    height: 100,
    justifyContent: 'center',
  },
  lockedLine: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    width: '80%',
  },
  lockOverlay: {
    position: 'absolute',
    top: 80,
    left: spacing.lg,
    right: spacing.lg,
  },
  lockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.lg,
  },
  lockEmoji: {
    fontSize: 40,
    textAlign: 'center',
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
  lockSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  contactRow: {
    marginTop: 16,
  },
  contactEmail: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  // Discover state
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cityInput: {
    flex: 1,
    marginBottom: 0,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchLabel: {
    fontSize: 13,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 40,
    flexGrow: 1,
  },
  workerCard: {
    marginBottom: 12,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  workerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  availDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  workerCity: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  workerExp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  skillsRow: {
    marginTop: 8,
    paddingBottom: 2,
  },
  skillChip: {
    backgroundColor: colors.primary + '15',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
  },
  skillText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  workerBio: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
});
