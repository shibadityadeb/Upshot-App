import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createApiClient } from '@upshot/api-client';
import type { HomeCard, HomeCardPayload } from '@upshot/types';
import { colors, Font, FontSize, Gap, radius, shadow, useResponsive } from '../../src/constants/theme';
import { Button, Input, EmptyState } from '../../src/components/common';

const api = createApiClient();
const HERO_LIQUID = require('../../assets/hero-liquid.png');

type Draft = {
  id?: string;
  title: string;
  subtitle: string;
  badge: string;
  cta: string;
  cover_url: string;
  link: string;
  sort_order: string;
  is_active: boolean;
};

const EMPTY_DRAFT: Draft = {
  title: '',
  subtitle: '',
  badge: '',
  cta: '',
  cover_url: '',
  link: '',
  sort_order: '0',
  is_active: true,
};

export default function AdminHomeCards() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const r = useResponsive();
  const columnStyle = { width: '100%' as const, maxWidth: r.contentWidth, alignSelf: 'center' as const };

  const [cards, setCards] = useState<HomeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await api.homeCards.getAllCards();
    if (res.data) setCards(res.data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const openNew = () => setEditing({ ...EMPTY_DRAFT, sort_order: String(cards.length) });
  const openEdit = (c: HomeCard) =>
    setEditing({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle ?? '',
      badge: c.badge ?? '',
      cta: c.cta ?? '',
      cover_url: c.cover_url ?? '',
      link: c.link,
      sort_order: String(c.sort_order),
      is_active: c.is_active,
    });

  const save = useCallback(async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.link.trim()) {
      Alert.alert('Missing fields', 'Title and link are required.');
      return;
    }
    setSaving(true);
    const payload: HomeCardPayload = {
      title: editing.title.trim(),
      subtitle: editing.subtitle.trim() || null,
      badge: editing.badge.trim() || null,
      cta: editing.cta.trim() || null,
      cover_url: editing.cover_url.trim() || null,
      link: editing.link.trim(),
      sort_order: parseInt(editing.sort_order, 10) || 0,
      is_active: editing.is_active,
    };
    const res = editing.id
      ? await api.homeCards.updateCard(editing.id, payload)
      : await api.homeCards.createCard(payload);
    setSaving(false);
    if (res.error) {
      Alert.alert('Could not save', res.error.message);
      return;
    }
    setEditing(null);
    load();
  }, [editing, load]);

  const remove = useCallback(
    (c: HomeCard) => {
      Alert.alert('Delete card', `Remove "${c.title}" from the home screen?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await api.homeCards.deleteCard(c.id);
            load();
          },
        },
      ]);
    },
    [load],
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
      {/* Lime liquid header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={HERO_LIQUID} style={styles.headerBg} resizeMode="cover" />
        <View style={[columnStyle, styles.headerRow]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={18} color={colors.ink} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Home Cards</Text>
            <Text style={styles.headerSubtitle}>Featured Experiences on the home screen</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={openNew} activeOpacity={0.85}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addBtnText}>New</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={cards}
        keyExtractor={(c) => c.id}
        contentContainerStyle={[styles.listContent, columnStyle]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            iconName="albums-outline"
            title="No home cards yet"
            subtitle="Add a card and it appears in Featured Experiences on everyone's home screen."
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.card, !item.is_active && styles.cardHidden]}>
            <View style={styles.cardCover}>
              {item.cover_url ? (
                <Image source={{ uri: item.cover_url }} style={styles.coverImg} resizeMode="cover" />
              ) : (
                <View style={[styles.coverImg, styles.coverFallback]}>
                  <Ionicons name="image-outline" size={22} color={colors.textLight} />
                </View>
              )}
              <View style={styles.orderPill}>
                <Text style={styles.orderPillText}>#{item.sort_order}</Text>
              </View>
              {!item.is_active && (
                <View style={styles.hiddenPill}>
                  <Text style={styles.hiddenPillText}>Hidden</Text>
                </View>
              )}
            </View>
            <View style={styles.cardBody}>
              {!!item.badge && <Text style={styles.cardBadge}>{item.badge}</Text>}
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              {!!item.subtitle && <Text style={styles.cardSub} numberOfLines={2}>{item.subtitle}</Text>}
              <View style={styles.linkRow}>
                <Ionicons name="link-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.linkText} numberOfLines={1}>{item.link}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)} activeOpacity={0.85}>
                  <Ionicons name="create-outline" size={15} color={colors.ink} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.delBtn} onPress={() => remove(item)} activeOpacity={0.85}>
                  <Ionicons name="trash-outline" size={15} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Add / edit sheet */}
      <Modal visible={!!editing} transparent animationType="slide" onRequestClose={() => setEditing(null)}>
        <View style={styles.sheetOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + Gap.base }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{editing?.id ? 'Edit card' : 'New card'}</Text>
              <TouchableOpacity onPress={() => setEditing(null)} activeOpacity={0.7}>
                <Ionicons name="close" size={22} color={colors.ink} />
              </TouchableOpacity>
            </View>
            {editing && (
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Input label="Title" placeholder="Host Your Event on Upshot" value={editing.title} onChangeText={(t) => setEditing({ ...editing, title: t })} />
                <Input label="Subtitle" placeholder="Bring your idea to life…" value={editing.subtitle} onChangeText={(t) => setEditing({ ...editing, subtitle: t })} multiline numberOfLines={2} />
                <Input label="Badge" placeholder="Featured Event" value={editing.badge} onChangeText={(t) => setEditing({ ...editing, badge: t })} />
                <Input label="Button label (CTA)" placeholder="Create Event" value={editing.cta} onChangeText={(t) => setEditing({ ...editing, cta: t })} />
                <Input label="Cover image URL" placeholder="https://…/image.jpg" value={editing.cover_url} onChangeText={(t) => setEditing({ ...editing, cover_url: t })} autoCapitalize="none" />
                <Input label="Redirect link" placeholder="/(people)/campus-cartel  or  https://…" value={editing.link} onChangeText={(t) => setEditing({ ...editing, link: t })} autoCapitalize="none" />
                <Input label="Order" placeholder="0" value={editing.sort_order} onChangeText={(t) => setEditing({ ...editing, sort_order: t.replace(/[^0-9]/g, '') })} keyboardType="number-pad" />
                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>Active</Text>
                    <Text style={styles.switchHint}>Shown on the home screen</Text>
                  </View>
                  <Switch
                    value={editing.is_active}
                    onValueChange={(v) => setEditing({ ...editing, is_active: v })}
                    trackColor={{ true: colors.primary, false: colors.border }}
                    thumbColor="#fff"
                  />
                </View>
                <Button title={editing.id ? 'Save changes' : 'Add card'} onPress={save} loading={saving} disabled={saving} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.ink, borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 9,
  },
  addBtnText: { fontSize: FontSize.small, fontWeight: Font.black, color: '#fff' },

  listContent: { padding: Gap.base, paddingBottom: 100, gap: Gap.base, flexGrow: 1 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadow.sm,
  },
  cardHidden: { opacity: 0.6 },
  cardCover: { height: 120, position: 'relative', backgroundColor: colors.surfaceAlt },
  coverImg: { width: '100%', height: '100%' },
  coverFallback: { alignItems: 'center', justifyContent: 'center' },
  orderPill: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(14,14,14,0.6)', borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 3,
  },
  orderPillText: { fontSize: FontSize.xs, fontWeight: Font.black, color: '#fff' },
  hiddenPill: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: 'rgba(14,14,14,0.6)', borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 3,
  },
  hiddenPillText: { fontSize: FontSize.xs, fontWeight: Font.black, color: '#fff' },
  cardBody: { padding: Gap.base },
  cardBadge: { fontSize: FontSize.xs, fontWeight: Font.black, color: colors.primaryDark, letterSpacing: 0.5, marginBottom: 2 },
  cardTitle: { fontSize: FontSize.h3, fontWeight: Font.black, color: colors.ink },
  cardSub: { fontSize: FontSize.small, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  linkText: { flex: 1, fontSize: FontSize.xs, color: colors.textSecondary },
  cardActions: { flexDirection: 'row', gap: Gap.sm, marginTop: Gap.md },
  editBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 42, borderRadius: radius.full, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
  },
  editBtnText: { fontSize: FontSize.small, fontWeight: Font.bold, color: colors.ink },
  delBtn: {
    width: 42, height: 42, borderRadius: radius.full,
    backgroundColor: colors.error + '14', alignItems: 'center', justifyContent: 'center',
  },

  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    maxHeight: '88%',
    paddingHorizontal: Gap.base,
    paddingTop: Gap.base,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.base,
  },
  sheetTitle: { fontSize: FontSize.h2, fontWeight: Font.black, color: colors.ink },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Gap.base },
  switchLabel: { fontSize: FontSize.body, fontWeight: Font.bold, color: colors.ink },
  switchHint: { fontSize: FontSize.xs, color: colors.textSecondary, marginTop: 1 },
});
