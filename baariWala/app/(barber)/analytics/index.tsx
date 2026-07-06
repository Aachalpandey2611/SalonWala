import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface NavCardProps {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  index: number;
}

const NavCard: React.FC<NavCardProps> = ({ icon, title, subtitle, color, onPress, index }) => (
  <Animated.View entering={FadeInDown.duration(400).delay(100 + index * 50)} style={styles.navCardWrapper}>
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.navCard}>
      <View style={[styles.navIconBox, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.navText}>
        <Text style={[Typography.titleS, { color: Colors.textPrimary }]}>{title}</Text>
        <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 2 }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
    </TouchableOpacity>
  </Animated.View>
);

export default function AnalyticsDashboardScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Business Intelligence" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Summary Cards */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.heroSection}>
          <View style={styles.heroPrimary}>
            <Text style={[Typography.label, { color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.xs }]}>
              Today's Earnings
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={[Typography.displayL, { color: Colors.textInverse, fontSize: 40 }]}>₹4,520</Text>
              <View style={styles.trendUp}>
                <Ionicons name="trending-up" size={14} color={Colors.success} />
                <Text style={[Typography.caption, { color: Colors.success, marginLeft: 2, fontWeight: '700' }]}>12%</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroGrid}>
            <View style={styles.heroSubCard}>
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: 4 }]}>Weekly</Text>
              <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>₹24,180</Text>
            </View>
            <View style={styles.heroSubCard}>
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: 4 }]}>Monthly</Text>
              <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>₹88,400</Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiItem}>
              <Text style={[Typography.caption, { color: Colors.textTertiary }]}>Avg. Ticket Size</Text>
              <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600' }]}>₹280</Text>
            </View>
            <View style={styles.kpiItem}>
              <Text style={[Typography.caption, { color: Colors.textTertiary }]}>Completed Today</Text>
              <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600' }]}>18</Text>
            </View>
            <View style={styles.kpiItem}>
              <Text style={[Typography.caption, { color: Colors.textTertiary }]}>Pending Dues</Text>
              <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600' }]}>₹0</Text>
            </View>
          </View>
        </Animated.View>

        {/* Navigation Grid */}
        <View style={styles.navSection}>
          <Text style={[Typography.label, styles.sectionLabel]}>Detailed Analytics</Text>
          
          <NavCard
            icon="bar-chart" title="Revenue Analytics" subtitle="Trends, breakdown, growth" color={Colors.primary}
            onPress={() => router.push('/(barber)/analytics/revenue')} index={0}
          />
          <NavCard
            icon="calendar" title="Booking Analytics" subtitle="Completed, cancelled, walk-ins" color={Colors.accent}
            onPress={() => router.push('/(barber)/analytics/bookings')} index={1}
          />
          <NavCard
            icon="people" title="Customer Insights" subtitle="Retention, new vs returning" color={Colors.success}
            onPress={() => router.push('/(barber)/analytics/customers')} index={2}
          />
          <NavCard
            icon="cut" title="Service Performance" subtitle="Most popular, highest revenue" color={Colors.warning}
            onPress={() => router.push('/(barber)/analytics/services')} index={3}
          />
        </View>

        <View style={styles.navSection}>
          <Text style={[Typography.label, styles.sectionLabel]}>Operations & Reports</Text>
          
          <NavCard
            icon="receipt" title="Transactions" subtitle="All payment history" color={Colors.textSecondary}
            onPress={() => router.push('/(barber)/analytics/transactions')} index={4}
          />
          <NavCard
            icon="document-text" title="Generate Reports" subtitle="Daily, weekly, monthly exports" color={Colors.primary}
            onPress={() => router.push('/(barber)/analytics/reports')} index={5}
          />
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxxxxl,
    paddingTop: Spacing.m,
  },
  heroSection: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.xl,
  },
  heroPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.m,
    ...Shadow.floating,
  },
  trendUp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successSoft,
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginLeft: Spacing.m,
  },
  heroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.m,
  },
  heroSubCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.l,
    borderRadius: Radius.l,
    marginRight: Spacing.s,
    ...Shadow.card,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: Radius.l,
    ...Shadow.card,
  },
  kpiItem: {
    alignItems: 'center',
  },
  navSection: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.l,
  },
  sectionLabel: {
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.m,
  },
  navCardWrapper: {
    marginBottom: Spacing.m,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: Radius.l,
    ...Shadow.card,
  },
  navIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  navText: {
    flex: 1,
  },
});
