import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Avatar } from '../../../components/ui/Avatar';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Dummy Donut/Pie representation
const SimulatedDonut = () => (
  <View style={styles.donutContainer}>
    <View style={styles.donutOuter}>
      <View style={styles.donutInner}>
        <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>1,204</Text>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Total</Text>
      </View>
    </View>
    <View style={styles.donutLegend}>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>New (65%)</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: Colors.accent }]} />
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Returning (35%)</Text>
      </View>
    </View>
  </View>
);

const TOP_CUSTOMERS = [
  { id: '1', name: 'Rahul Verma', visits: 12, spent: '₹3,600' },
  { id: '2', name: 'Amit Kumar', visits: 8, spent: '₹2,400' },
  { id: '3', name: 'Sandeep Yadav', visits: 7, spent: '₹2,100' },
];

export default function CustomerInsightsScreen() {
  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Customer Insights" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.m }]}>Customer Retention</Text>
          <View style={styles.card}>
            <SimulatedDonut />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: Colors.warningSoft }]}>
                <Ionicons name="time" size={18} color={Colors.warning} />
              </View>
              <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>14 min</Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: 'center' }]}>Avg. Wait Time</Text>
            </View>
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: Colors.successSoft }]}>
                <Ionicons name="calendar" size={18} color={Colors.success} />
              </View>
              <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>3.2 Wks</Text>
              <Text style={[Typography.caption, { color: Colors.textSecondary, textAlign: 'center' }]}>Avg. Visit Freq</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.m }]}>Top Customers (This Month)</Text>
          <View style={styles.card}>
            {TOP_CUSTOMERS.map((cust, i) => (
              <View key={cust.id}>
                <View style={styles.customerRow}>
                  <Text style={[Typography.bodyM, { color: Colors.textTertiary, width: 24, fontWeight: '700' }]}>{i + 1}</Text>
                  <Avatar size={36} initials={cust.name.charAt(0)} />
                  <View style={styles.customerInfo}>
                    <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600' }]}>{cust.name}</Text>
                    <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{cust.visits} visits</Text>
                  </View>
                  <Text style={[Typography.titleS, { color: Colors.success }]}>{cust.spent}</Text>
                </View>
                {i < TOP_CUSTOMERS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
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
  // Donut
  donutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 16,
    borderColor: Colors.primary,
    borderTopColor: Colors.accent,
    borderRightColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInner: {
    alignItems: 'center',
  },
  donutLegend: {
    marginLeft: Spacing.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.s,
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
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.s,
  },
  customerInfo: {
    flex: 1,
    marginLeft: Spacing.m,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.s,
  },
});
