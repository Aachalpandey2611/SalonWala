import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Dummy Chart Component (Line Area)
const SimulatedAreaChart = ({ color }: { color: string }) => {
  return (
    <View style={styles.chartContainer}>
      <View style={[styles.areaFill, { backgroundColor: color + '30' }]}>
        <View style={styles.linePath} />
      </View>
      <View style={styles.xLabels}>
        {['9AM', '11AM', '1PM', '3PM', '5PM', '7PM', '9PM'].map((l, i) => (
          <Text key={i} style={[Typography.caption, { color: Colors.textTertiary, fontSize: 10 }]}>{l}</Text>
        ))}
      </View>
    </View>
  );
};

const MetricRow = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <View style={styles.metricRow}>
    <View style={styles.metricLeft}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[Typography.bodyM, { color: Colors.textSecondary, marginLeft: Spacing.s }]}>{label}</Text>
    </View>
    <Text style={[Typography.titleS, { color: Colors.textPrimary }]}>{value}</Text>
  </View>
);

export default function BookingAnalyticsScreen() {
  const [filter, setFilter] = useState('Today');

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header 
        title="Booking Analytics" 
        showBack 
        rightElement={
          <TouchableOpacity style={styles.filterPill}>
            <Text style={[Typography.caption, { color: Colors.primary, fontWeight: '600' }]}>{filter}</Text>
            <Ionicons name="chevron-down" size={12} color={Colors.primary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewItem}>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Total Bookings</Text>
              <Text style={[Typography.displayM, { color: Colors.textPrimary }]}>42</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Completion Rate</Text>
              <Text style={[Typography.displayM, { color: Colors.success }]}>92%</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.m }]}>Booking Breakdown</Text>
          <View style={styles.card}>
            <MetricRow label="Completed" value="38" color={Colors.success} />
            <View style={styles.divider} />
            <MetricRow label="Cancelled" value="3" color={Colors.error} />
            <View style={styles.divider} />
            <MetricRow label="No Shows" value="1" color={Colors.textTertiary} />
            <View style={styles.divider} />
            <MetricRow label="Walk-ins (No Appt)" value="12" color={Colors.accent} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.m }]}>Peak Booking Hours</Text>
          <View style={styles.card}>
            <SimulatedAreaChart color={Colors.primary} />
            <View style={styles.insightBox}>
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: Spacing.s, flex: 1 }]}>
                Your busiest time today was <Text style={{ fontWeight: '600', color: Colors.textPrimary }}>5:00 PM</Text> to <Text style={{ fontWeight: '600', color: Colors.textPrimary }}>7:00 PM</Text>.
              </Text>
            </View>
          </View>
        </Animated.View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxxxxl,
    paddingTop: Spacing.m,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EAF6',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  section: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.xl,
  },
  overviewCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.card,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderSubtle,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    padding: Spacing.l,
    ...Shadow.card,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.s,
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.xs,
  },
  // Dummy Chart
  chartContainer: {
    height: 140,
    marginBottom: Spacing.m,
  },
  areaFill: {
    flex: 1,
    borderTopLeftRadius: Radius.m,
    borderTopRightRadius: Radius.m,
    borderTopWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linePath: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  xLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
    padding: Spacing.m,
    borderRadius: Radius.m,
    marginTop: Spacing.s,
  },
});
