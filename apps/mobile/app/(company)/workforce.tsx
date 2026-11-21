import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Switch,
  TouchableOpacity,
  Linking,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import { useAuthStore } from '../../src/store/auth.store';
import {
  colors,
  Font,
  FontSize,
  Gap,
  radius,
  shadow,
  useResponsive,
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
const HERO_LIQUID = require('../../assets/hero-liquid.png');

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
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

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
        <AvatarCircle name={item.user?.full_name ?? 'Worker'} size={48} />
        <View style={styles.workerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.workerName} numberOfLines={1}>{item.user?.full_name ?? 'Unknown'}</Text>
            <View
              style={[
                styles.availDot,
                { backgroundColor: item.is_available ? colors.success : colors.border },
              ]}
            />
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.workerCity} numberOfLines={1}>
              {item.city}{item.state ? `, ${item.state}` : ''}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="briefcase-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.workerExp}>{item.experience_years} years experience</Text>
          </View>
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
    <View style={styles.container}>
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={columnStyle}>
          <Text style={styles.headerTitle}>Find talent</Text>
          <Text style={styles.headerSubtitle}>Browse UBM's verified on-ground workforce</Text>
        </View>
      </View>

      {!canDiscover ? (
        <View style={[styles.lockedContainer, columnStyle]}>
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
              <View style={styles.lockIcon}>
                <Ionicons name="lock-closed" size={26} color={colors.ink} />
              </View>
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
          <View style={[styles.filterRow, columnStyle]}>
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
            contentContainerStyle={[styles.listContent, columnStyle]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                iconName="people-outline"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerTitle: {
    fontSize: FontSize.display,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.7,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: '#2c3326',
    marginTop: 3,
    fontWeight: Font.semibold,
  },

  // Locked state
  lockedContainer: {
    flex: 1,
    position: 'relative',
  },
  lockedList: {
    paddingTop: Gap.base,
    paddingHorizontal: Gap.base,
  },
  lockedCard: {
    opacity: 0.3,
    marginBottom: Gap.md,
    height: 100,
    justifyContent: 'center',
    padding: Gap.base,
  },
  lockedLine: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    width: '80%',
  },
  lockOverlay: {
    position: 'absolute',
    top: 70,
    left: Gap.base,
    right: Gap.base,
  },
  lockCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Gap.lg,
    alignItems: 'center',
    ...shadow.lg,
  },
  lockIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.md,
  },
  lockTitle: {
    fontSize: FontSize.h2,
    fontWeight: Font.black,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  lockSubtitle: {
    fontSize: FontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  contactRow: {
    marginTop: Gap.base,
  },
  contactEmail: {
    fontSize: FontSize.body,
    color: colors.ink,
    fontWeight: Font.bold,
    textDecorationLine: 'underline',
  },

  // Discover state
  filterRow: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.md,
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
    fontSize: FontSize.small,
    color: colors.text,
    fontWeight: Font.semibold,
  },
  listContent: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.base,
    paddingBottom: 110,
    flexGrow: 1,
  },
  workerCard: {
    marginBottom: Gap.md,
    padding: Gap.base,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  workerInfo: {
    flex: 1,
    marginLeft: Gap.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.sm,
  },
  workerName: {
    flex: 1,
    fontSize: FontSize.h3,
    fontWeight: Font.black,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  availDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  workerCity: {
    flex: 1,
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontWeight: Font.medium,
  },
  workerExp: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    fontWeight: Font.medium,
  },
  skillsRow: {
    marginTop: Gap.md,
    paddingBottom: 2,
    gap: 6,
  },
  skillChip: {
    backgroundColor: colors.primaryTint,
    borderRadius: radius.full,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  skillText: {
    fontSize: FontSize.xs,
    color: colors.ink,
    fontWeight: Font.bold,
  },
  workerBio: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
    marginTop: Gap.md,
    lineHeight: 19,
  },
});
