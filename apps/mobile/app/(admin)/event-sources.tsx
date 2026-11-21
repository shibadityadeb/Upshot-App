import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { EventSource } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

export default function AdminEventSources() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [sources, setSources] = useState<EventSource[]>([]);
  const [cityDraft, setCityDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api.eventSources.list();
    if (res.data) {
      setSources(res.data);
      setCityDraft(Object.fromEntries(res.data.map((s) => [s.id, (s.cities ?? []).join(', ')])));
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const toggle = useCallback(async (s: EventSource, enabled: boolean) => {
    setBusyId(s.id);
    setSources((prev) => prev.map((x) => (x.id === s.id ? { ...x, enabled } : x)));
    await api.eventSources.update(s.id, { enabled });
    setBusyId(null);
  }, []);

  const saveCities = useCallback(async (s: EventSource) => {
    setBusyId(s.id);
    const cities = (cityDraft[s.id] ?? '')
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const res = await api.eventSources.update(s.id, { cities });
    setBusyId(null);
    if (res.error) Alert.alert('Could not save', res.error.message);
    else load();
  }, [cityDraft, load]);

  const syncNow = useCallback(async () => {
    setSyncing(true);
    const res = await api.eventSources.syncNow();
    setSyncing(false);
    if (res.error) {
      Alert.alert('Sync failed', res.error.message);
    } else {
      Alert.alert('Sync complete', 'The event list has been refreshed.');
      load();
    }
  }, [load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={[columnStyle, styles.headerRow]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={18} color={colors.ink} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Event Sources</Text>
            <Text style={styles.headerSubtitle}>Pull free events in, daily</Text>
          </View>
          <TouchableOpacity style={styles.syncBtn} onPress={syncNow} activeOpacity={0.85} disabled={syncing}>
            {syncing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="sync" size={15} color="#fff" />
                <Text style={styles.syncBtnText}>Sync now</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, columnStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.note}>
          Enabled sources sync automatically every day. New events appear for people, old ones drop off.
          Registration always opens the official host — Upshot never takes it.
        </Text>

        {sources.map((s) => (
          <View key={s.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.sourceIcon}>
                <Ionicons name={s.key === 'ticketmaster' ? 'ticket-outline' : 'globe-outline'} size={20} color={colors.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sourceName}>{s.name}</Text>
                <Text style={styles.sourceMeta}>
                  {s.last_synced_at
                    ? `Last synced ${new Date(s.last_synced_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                    : 'Never synced'}
                </Text>
              </View>
              <Switch
                value={s.enabled}
                onValueChange={(v) => toggle(s, v)}
                disabled={busyId === s.id}
                trackColor={{ true: colors.primary, false: colors.border }}
                thumbColor="#fff"
              />
            </View>

            {!!s.last_result && (
              <View style={styles.resultPill}>
                <Text style={styles.resultText}>{s.last_result}</Text>
              </View>
            )}

            <Text style={styles.fieldLabel}>CITIES {s.key === 'schema_org' ? '(not used)' : '(comma-separated, blank = all India)'}</Text>
            <View style={styles.cityRow}>
              <TextInput
                style={styles.cityInput}
                value={cityDraft[s.id] ?? ''}
                onChangeText={(t) => setCityDraft((d) => ({ ...d, [s.id]: t }))}
                placeholder="Indore, Bhopal, Mumbai…"
                placeholderTextColor={colors.textLight}
                autoCapitalize="words"
                editable={s.key !== 'schema_org'}
              />
              <TouchableOpacity
                style={styles.saveCity}
                onPress={() => saveCities(s)}
                activeOpacity={0.85}
                disabled={busyId === s.id || s.key === 'schema_org'}
              >
                <Text style={styles.saveCityText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: Gap.base,
    paddingBottom: Gap.xxl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerBg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Gap.sm },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: FontSize.display, fontWeight: Font.black, color: colors.ink, letterSpacing: -0.7 },
  headerSubtitle: { fontSize: FontSize.small, color: '#2c3326', marginTop: 2, fontWeight: Font.semibold },
  syncBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.ink, borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 9, minWidth: 92, justifyContent: 'center',
  },
  syncBtnText: { fontSize: FontSize.small, fontWeight: Font.black, color: '#fff' },

  content: { padding: Gap.base, paddingBottom: 100 },
  note: { fontSize: FontSize.small, color: colors.textSecondary, lineHeight: 19, marginBottom: Gap.base },

  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.xxl, padding: Gap.base, marginBottom: Gap.base, ...shadow.sm,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Gap.md },
  sourceIcon: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },
  sourceName: { fontSize: FontSize.h3, fontWeight: Font.black, color: colors.ink },
  sourceMeta: { fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 1 },
  resultPill: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 8, marginTop: Gap.md,
  },
  resultText: { fontSize: FontSize.xs, color: colors.textSecondary },
  fieldLabel: { fontSize: FontSize.micro, fontWeight: Font.bold, letterSpacing: 1.2, color: colors.textSecondary, marginTop: Gap.base, marginBottom: 6 },
  cityRow: { flexDirection: 'row', gap: Gap.sm },
  cityInput: {
    flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, height: 44, fontSize: FontSize.body, color: colors.ink,
  },
  saveCity: {
    paddingHorizontal: 18, height: 44, borderRadius: radius.md, backgroundColor: colors.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  saveCityText: { fontSize: FontSize.small, fontWeight: Font.black, color: '#fff' },
});
