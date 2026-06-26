import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiClient } from '@upshot/api-client';
import type { Ambassador, Student } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius } from '../../src/constants/theme';
import { AvatarCircle, LoadingScreen, EmptyState } from '../../src/components/common';
import { useAuthStore } from '../../src/store/auth.store';

const api = createApiClient();

export default function AmbassadorReferrals() {
  const user = useAuthStore((s) => s.user);

  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const ambassadorResult = await api.ambassadors.getMyAmbassadorProfile(user.id);
      if (ambassadorResult.data) {
        setAmbassador(ambassadorResult.data);
        const studentsResult = await api.ambassadors.getAmbassadorStudents(
          ambassadorResult.data.id
        );
        if (studentsResult.data) {
          const sorted = [...studentsResult.data].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setStudents(sorted);
        }
      }
    } catch {
      Alert.alert('Error', 'Failed to load referrals.');
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  if (loading) return <LoadingScreen />;

  const filtered = search.trim()
    ? students.filter((s) =>
        (s.user?.full_name ?? 'Student')
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
    : students;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Dark header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Referrals</Text>
          {ambassador && students.length > 0 && (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{students.length} total</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerSubtitle}>People who joined using your code</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name…"
            placeholderTextColor={colors.textLight}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={
          filtered.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="👥"
            title={search.trim() ? 'No results found' : 'No referrals yet'}
            subtitle={
              search.trim()
                ? 'Try a different name'
                : 'Share your referral code to bring people in'
            }
          />
        ) : (
          <View style={styles.listCard}>
            {filtered.map((student, idx) => (
              <View key={student.id}>
                <View style={styles.studentRow}>
                  <AvatarCircle
                    name={student.user?.full_name ?? 'Student'}
                    size={44}
                  />
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName} numberOfLines={1}>
                      {student.user?.full_name ?? 'Student'}
                    </Text>
                    <Text style={styles.studentSub} numberOfLines={1}>
                      {student.profession ?? student.college ?? 'Member'}
                    </Text>
                  </View>
                  <Text style={styles.studentDate}>
                    {new Date(student.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short',
                    })}
                  </Text>
                </View>
                {idx < filtered.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    backgroundColor: colors.dark,
    paddingTop: Gap.lg,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  countPill: {
    backgroundColor: 'rgba(123,197,90,0.15)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(123,197,90,0.3)',
  },
  countText: {
    fontSize: FontSize.small,
    fontWeight: Font.semibold,
    color: colors.accent,
  },

  // Search
  searchSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: Gap.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: Gap.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.body,
    color: colors.text,
    paddingVertical: 11,
  },

  // List
  listContainer: {
    paddingHorizontal: Gap.base,
    paddingTop: Gap.md,
    paddingBottom: 100,
  },
  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: Gap.base,
    paddingTop: Gap.xl,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: Gap.md,
  },
  studentInfo: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 14,
    fontWeight: Font.bold,
    color: colors.text,
  },
  studentSub: {
    fontSize: FontSize.small,
    color: colors.textSecondary,
  },
  studentDate: {
    fontSize: FontSize.xs,
    color: colors.textLight,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
});
