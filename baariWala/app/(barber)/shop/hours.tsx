import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Button } from '../../../components/ui/Button';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const WEEK_DAYS = [
  { id: 'mon', label: 'Monday', active: true, open: '09:00 AM', close: '09:00 PM' },
  { id: 'tue', label: 'Tuesday', active: true, open: '09:00 AM', close: '09:00 PM' },
  { id: 'wed', label: 'Wednesday', active: true, open: '09:00 AM', close: '09:00 PM' },
  { id: 'thu', label: 'Thursday', active: true, open: '09:00 AM', close: '09:00 PM' },
  { id: 'fri', label: 'Friday', active: true, open: '09:00 AM', close: '09:00 PM' },
  { id: 'sat', label: 'Saturday', active: true, open: '09:00 AM', close: '10:00 PM' },
  { id: 'sun', label: 'Sunday', active: false, open: '-', close: '-' },
];

export default function WorkingHoursScreen() {
  const router = useRouter();
  const [days, setDays] = useState(WEEK_DAYS);
  const [lunchBreak, setLunchBreak] = useState(true);

  const toggleDay = (id: string) => {
    setDays(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Working Hours & Breaks" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Schedule */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[Typography.label, styles.sectionLabel]}>Weekly Schedule</Text>
            <TouchableOpacity>
              <Text style={[Typography.label, { color: Colors.accent }]}>Apply Template</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {days.map((day, index) => (
              <View key={day.id} style={[styles.dayRow, index < days.length - 1 && styles.dayRowBorder]}>
                <View style={styles.dayLeft}>
                  <Switch
                    value={day.active}
                    onValueChange={() => toggleDay(day.id)}
                    trackColor={{ false: Colors.borderSubtle, true: Colors.success }}
                    style={{ transform: [{ scale: 0.8 }] }}
                  />
                  <Text style={[Typography.bodyM, { color: day.active ? Colors.textPrimary : Colors.textTertiary, marginLeft: Spacing.s, fontWeight: day.active ? '600' : '400' }]}>
                    {day.label}
                  </Text>
                </View>

                {day.active ? (
                  <View style={styles.timeBox}>
                    <TouchableOpacity style={styles.timeBtn}>
                      <Text style={[Typography.bodyM, { color: Colors.primary }]}>{day.open}</Text>
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: Spacing.xs, color: Colors.textTertiary }}>-</Text>
                    <TouchableOpacity style={styles.timeBtn}>
                      <Text style={[Typography.bodyM, { color: Colors.primary }]}>{day.close}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={[Typography.caption, { color: Colors.error, fontWeight: '600' }]}>Closed</Text>
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Breaks */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Daily Breaks</Text>
          <View style={styles.card}>
            <View style={styles.breakRow}>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600' }]}>Lunch Break</Text>
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 2 }]}>01:30 PM - 02:30 PM</Text>
              </View>
              <Switch
                value={lunchBreak}
                onValueChange={setLunchBreak}
                trackColor={{ false: Colors.borderSubtle, true: Colors.accent }}
              />
            </View>
            
            <TouchableOpacity style={styles.addBreakBtn}>
              <Ionicons name="add" size={20} color={Colors.primary} />
              <Text style={[Typography.label, { color: Colors.primary, marginLeft: 6 }]}>Add Custom Break</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.actions}>
          <Button label="Save Schedule" onPress={() => router.back()} />
        </Animated.View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxxxxl,
    paddingTop: Spacing.l,
  },
  section: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sectionLabel: {
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    ...Shadow.card,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.m,
  },
  dayRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  dayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBtn: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.m,
  },
  breakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  addBreakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.m,
  },
  actions: {
    paddingHorizontal: Spacing.l,
    marginTop: Spacing.l,
  },
});
