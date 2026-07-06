import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Dummy Chart Component (Bar)
const SimulatedBarChart = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  return (
    <View style={styles.chartContainer}>
      {data.map((val, idx) => {
        const heightPct = (val / max) * 100;
        return (
          <View key={idx} style={styles.barCol}>
            <View style={[styles.barBg]}>
              <View style={[styles.barFill, { height: `${heightPct}%`, backgroundColor: color }]} />
            </View>
            <Text style={[Typography.caption, { color: Colors.textTertiary, fontSize: 10, marginTop: 4 }]}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

// Dummy Horizontal Bar for Breakdown
const SimulatedProgress = ({ label, pct, color }: { label: string, pct: number, color: string }) => (
  <View style={styles.progRow}>
    <Text style={[Typography.caption, { width: 60, color: Colors.textSecondary }]}>{label}</Text>
    <View style={styles.progBg}>
      <View style={[styles.progFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
    <Text style={[Typography.caption, { width: 40, textAlign: 'right', color: Colors.textPrimary, fontWeight: '600' }]}>{pct}%</Text>
  </View>
);

export default function RevenueAnalyticsScreen() {
  const [filter, setFilter] = useState('Last 7 Days');

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header 
        title="Revenue Analytics" 
        showBack 
        rightElement={
          <TouchableOpacity style={styles.filterPill}>
            <Text style={[Typography.caption, { color: Colors.primary, fontWeight: '600' }]}>{filter}</Text>
            <Ionicons name="chevron-down" size={12} color={Colors.primary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Revenue Trend Chart */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <View style={styles.card}>
            <Text style={[Typography.label, { color: Colors.textSecondary, marginBottom: Spacing.xs }]}>Total Revenue</Text>
            <Text style={[Typography.displayM, { color: Colors.textPrimary, marginBottom: Spacing.l }]}>₹24,180</Text>
            
            <SimulatedBarChart data={[3000, 2500, 4000, 3200, 4800, 6000, 5000]} color={Colors.primary} />
            
            <View style={styles.insightBox}>
              <Ionicons name="bulb-outline" size={16} color={Colors.accent} />
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: Spacing.s, flex: 1 }]}>
                Friday and Saturday accounted for <Text style={{ fontWeight: '600', color: Colors.textPrimary }}>45%</Text> of your weekly revenue.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Revenue Breakdown */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <View style={styles.card}>
            <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.m }]}>Revenue by Category</Text>
            <SimulatedProgress label="Haircuts" pct={60} color={Colors.primary} />
            <SimulatedProgress label="Beard" pct={25} color={Colors.accent} />
            <SimulatedProgress label="Coloring" pct={10} color={Colors.warning} />
            <SimulatedProgress label="Products" pct={5} color={Colors.success} />
          </View>
        </Animated.View>

        {/* Key Metrics */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: Colors.successSoft }]}>
                <Ionicons name="trending-up" size={18} color={Colors.success} />
              </View>
              <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>+18%</Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>vs Last Week</Text>
            </View>
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: Colors.primary + '18' }]}>
                <Ionicons name="cash-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>₹280</Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Avg. Ticket Size</Text>
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
    marginBottom: Spacing.l,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    padding: Spacing.l,
    ...Shadow.card,
  },
  // Dummy Chart
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: Spacing.m,
    paddingTop: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  barCol: {
    alignItems: 'center',
    width: '12%',
  },
  barBg: {
    width: 24,
    height: 120,
    backgroundColor: Colors.background,
    borderRadius: Radius.s,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: Radius.s,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.accentSoft,
    padding: Spacing.m,
    borderRadius: Radius.m,
    marginTop: Spacing.s,
  },
  // Dummy Progress
  progRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  progBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    marginHorizontal: Spacing.m,
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.l,
    borderRadius: Radius.l,
    alignItems: 'center',
    ...Shadow.card,
    marginHorizontal: Spacing.xs,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s,
  },
});
