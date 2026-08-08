import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, Font, FontSize, Gap, radius } from '../../constants/theme';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Calendar bottom-sheet. Emits `YYYY-MM-DD`. Past dates are not selectable. */
export function DatePickerModal({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean;
  onSelect: (date: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const atCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const isPastDay = (day: number) =>
    new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (atCurrentMonth) return;
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const handleSelect = (day: number) => {
    if (isPastDay(day)) return;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onSelect(`${year}-${m}-${d}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={sheetStyles.overlay}>
        <View style={sheetStyles.sheet}>
          <View style={sheetStyles.header}>
            <Text style={sheetStyles.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={dateStyles.nav}>
            <TouchableOpacity onPress={prevMonth} activeOpacity={0.7} disabled={atCurrentMonth}>
              <Ionicons name="chevron-back" size={22} color={atCurrentMonth ? colors.border : colors.text} />
            </TouchableOpacity>
            <Text style={dateStyles.navTitle}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={dateStyles.weekRow}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <Text key={d} style={dateStyles.weekDay}>{d}</Text>
            ))}
          </View>
          <View style={dateStyles.grid}>
            {days.map((day, i) => {
              const disabled = day ? isPastDay(day) : false;
              return (
                <View key={i} style={dateStyles.dayCell}>
                  {day ? (
                    <TouchableOpacity
                      style={dateStyles.dayBtn}
                      onPress={() => handleSelect(day)}
                      activeOpacity={0.7}
                      disabled={disabled}
                    >
                      <Text style={[dateStyles.dayText, disabled && dateStyles.dayTextDisabled]}>{day}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/** Hour/minute/AM-PM stepper. Emits `hh:mm AM`. */
export function TimePickerModal({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean;
  onSelect: (time: string) => void;
  onClose: () => void;
}) {
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const adjustHour = (delta: number) => {
    setHour((h) => {
      const next = h + delta;
      if (next > 12) return 1;
      if (next < 1) return 12;
      return next;
    });
  };

  const adjustMinute = (delta: number) => {
    setMinute((m) => {
      const next = m + delta;
      if (next >= 60) return 0;
      if (next < 0) return 55;
      return next;
    });
  };

  const handleConfirm = () => {
    const h = String(hour).padStart(2, '0');
    const m = String(minute).padStart(2, '0');
    onSelect(`${h}:${m} ${period}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={sheetStyles.overlay}>
        <View style={sheetStyles.sheet}>
          <View style={sheetStyles.header}>
            <Text style={sheetStyles.title}>Select Time</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={timeStyles.container}>
            <View style={timeStyles.column}>
              <TouchableOpacity onPress={() => adjustHour(1)} activeOpacity={0.7} style={timeStyles.arrowBtn}>
                <Ionicons name="chevron-up" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={timeStyles.value}>{String(hour).padStart(2, '0')}</Text>
              <TouchableOpacity onPress={() => adjustHour(-1)} activeOpacity={0.7} style={timeStyles.arrowBtn}>
                <Ionicons name="chevron-down" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={timeStyles.separator}>:</Text>
            <View style={timeStyles.column}>
              <TouchableOpacity onPress={() => adjustMinute(5)} activeOpacity={0.7} style={timeStyles.arrowBtn}>
                <Ionicons name="chevron-up" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={timeStyles.value}>{String(minute).padStart(2, '0')}</Text>
              <TouchableOpacity onPress={() => adjustMinute(-5)} activeOpacity={0.7} style={timeStyles.arrowBtn}>
                <Ionicons name="chevron-down" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={timeStyles.periodCol}>
              <TouchableOpacity
                style={[timeStyles.periodBtn, period === 'AM' && timeStyles.periodBtnActive]}
                onPress={() => setPeriod('AM')}
                activeOpacity={0.7}
              >
                <Text style={[timeStyles.periodText, period === 'AM' && timeStyles.periodTextActive]}>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[timeStyles.periodBtn, period === 'PM' && timeStyles.periodBtnActive]}
                onPress={() => setPeriod('PM')}
                activeOpacity={0.7}
              >
                <Text style={[timeStyles.periodText, period === 'PM' && timeStyles.periodTextActive]}>PM</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={timeStyles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
            <Text style={timeStyles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const sheetStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: FontSize.h2, fontWeight: Font.bold, color: colors.text },
});

const dateStyles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Gap.base,
    paddingVertical: Gap.md,
  },
  navTitle: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.text },
  weekRow: { flexDirection: 'row', paddingHorizontal: Gap.sm },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xs,
    fontWeight: Font.semibold,
    color: colors.textLight,
    paddingVertical: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Gap.sm,
    paddingBottom: Gap.base,
  },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
  dayBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontSize: FontSize.body, color: colors.text },
  dayTextDisabled: { color: colors.border },
});

const timeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Gap.xl,
    gap: Gap.base,
  },
  column: { alignItems: 'center', gap: Gap.sm },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 36,
    fontWeight: Font.bold,
    color: colors.text,
    minWidth: 60,
    textAlign: 'center',
  },
  separator: { fontSize: 36, fontWeight: Font.bold, color: colors.text, marginBottom: 4 },
  periodCol: { gap: Gap.sm, marginLeft: Gap.md },
  periodBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodText: { fontSize: FontSize.body, fontWeight: Font.semibold, color: colors.textSecondary },
  periodTextActive: { color: colors.onPrimary, fontWeight: Font.bold },
  confirmBtn: {
    marginHorizontal: Gap.base,
    marginBottom: Gap.base,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { fontSize: FontSize.h3, fontWeight: Font.bold, color: colors.onPrimary },
});
