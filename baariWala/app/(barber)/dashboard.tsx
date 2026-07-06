import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../../components/ui/Avatar';
import { StatCard } from '../../components/dashboard/StatCard';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';
import { ActivityRow } from '../../components/dashboard/ActivityRow';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  DUMMY_STATS,
  DUMMY_UPCOMING,
  DUMMY_ACTIVITY,
  SHOP_STATUS_CONFIG,
  ShopStatus,
} from '../../data/barber-stats';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight, SlideInDown } from 'react-native-reanimated';

// Premium Components
import { AmbientBackground } from '../../components/ui/AmbientBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { FloatingActionCenter } from '../../components/ui/FloatingActionCenter';
import { AnimatedQueueVisualizer } from '../../components/queue/AnimatedQueueVisualizer';

const QUICK_ACTIONS = [
  { icon: 'list',             title: 'Live Queue',      description: 'Manage',     color: Colors.primary,   route: '/(barber)/live-queue' },
  { icon: 'add-circle',       title: 'Walk-in',         description: 'Instant',    color: Colors.success,   route: null },
  { icon: 'calendar',         title: 'Bookings',        description: 'Schedule',   color: Colors.accent,    route: '/(barber)/schedule' },
  { icon: 'cafe',             title: 'Take Break',      description: 'Pause',      color: Colors.warning,   route: null },
];

const CUSTOMER_STATUS_CONFIG = {
  waiting:    { label: 'Waiting',    color: Colors.warning },
  confirmed:  { label: 'Confirmed',  color: Colors.primary },
  in_service: { label: 'In Service', color: Colors.success },
};

export default function BarberDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [shopStatus, setShopStatus] = useState<ShopStatus>('online');

  const statusCfg = SHOP_STATUS_CONFIG[shopStatus];
  const STATUS_CYCLE: ShopStatus[] = ['online', 'busy', 'break', 'closed'];

  const cycleStatus = () => {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(shopStatus) + 1) % STATUS_CYCLE.length];
    setShopStatus(next);
  };

  const floatingActions = [
    { icon: 'qr-code-outline' as any, label: 'Scan QR', onPress: () => {} },
    { icon: 'calendar' as any, label: 'Add Booking', onPress: () => {} },
    { icon: 'person-add' as any, label: 'Walk-in', onPress: () => {} },
  ];

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, Spacing.l) }]}>
        
        {/* ===== HEADER ===== */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Good Morning 👋</Text>
            <Text style={[Typography.displayM, { color: Colors.textPrimary }]}>Style Zone</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={cycleStatus} style={[styles.statusIcon, { backgroundColor: statusCfg.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: statusCfg.color }]} />
            </TouchableOpacity>
            <Avatar size={44} initials="RS" />
          </View>
        </Animated.View>

        {/* ===== SMART HERO CARD ===== */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.section}>
          <GlassCard variant="card" style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View>
                <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Today's Revenue</Text>
                <Text style={[Typography.displayXL, { color: Colors.primary }]}>$1,240</Text>
              </View>
              <View style={styles.heroScore}>
                <Ionicons name="trending-up" size={16} color={Colors.success} />
                <Text style={[Typography.label, { color: Colors.success, marginLeft: 4 }]}>98% Efficiency</Text>
              </View>
            </View>

            {/* AI Insight inside Hero */}
            <View style={styles.aiInsight}>
              <Ionicons name="sparkles" size={16} color={Colors.accent} />
              <Text style={[Typography.bodyS, { color: Colors.textPrimary, marginLeft: Spacing.s, flex: 1 }]}>
                Today looks busier than yesterday. Peak rush expected at 5 PM.
              </Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* ===== LIVE QUEUE VISUALIZER ===== */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.titleM, styles.sectionTitle]}>Live Queue</Text>
            <TouchableOpacity onPress={() => router.push('/(barber)/live-queue')}>
              <Text style={[Typography.label, { color: Colors.accent }]}>Manage →</Text>
            </TouchableOpacity>
          </View>
          <GlassCard variant="card" style={styles.queueCard}>
            <AnimatedQueueVisualizer servingToken="8" nextTokens={['9', '10', '11', '12', '14']} />
            <View style={styles.queueStatsRow}>
              <View>
                <Text style={[Typography.label, { color: Colors.textSecondary }]}>Waiting</Text>
                <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>6 Customers</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[Typography.label, { color: Colors.textSecondary }]}>Avg Wait</Text>
                <Text style={[Typography.titleM, { color: Colors.warning }]}>14 mins</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* ===== QUICK ACTIONS WIDGETS ===== */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.section}>
          <Text style={[Typography.titleM, styles.sectionTitle]}>Command Center</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard
                key={action.title}
                icon={action.icon as any}
                title={action.title}
                description={action.description}
                color={action.color}
                onPress={() => {
                  if (action.route) router.push(action.route as any);
                }}
              />
            ))}
          </View>
        </Animated.View>

        {/* ===== UPCOMING BOOKINGS ===== */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.titleM, styles.sectionTitle]}>Upcoming</Text>
          </View>
          <GlassCard variant="card" style={styles.upcomingCard}>
            {DUMMY_UPCOMING.slice(0, 2).map((customer, index) => {
              const cStatus = CUSTOMER_STATUS_CONFIG[customer.status];
              return (
                <View key={customer.id} style={[styles.upcomingRow, index === 0 && styles.upcomingRowBorder]}>
                  <View style={styles.upcomingInfo}>
                    <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600' }]}>
                      {customer.name}
                    </Text>
                    <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
                      {customer.service} · {customer.time}
                    </Text>
                  </View>
                  <View style={[styles.cStatusBadge, { backgroundColor: cStatus.color + '18' }]}>
                    <Text style={[Typography.caption, { color: cStatus.color, fontWeight: '600' }]}>
                      {cStatus.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </GlassCard>
        </Animated.View>

      </ScrollView>

      {/* ===== FLOATING ACTION CENTER ===== */}
      <Animated.View entering={SlideInDown.duration(800).delay(600)} style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <FloatingActionCenter actions={floatingActions} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent', // Let AmbientBackground show through
  },
  scrollContent: {
    paddingBottom: Spacing.xxxxxl * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.l,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  section: {
    paddingHorizontal: Spacing.l,
    marginTop: Spacing.l,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  heroCard: {
    padding: Spacing.xl,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.l,
  },
  heroScore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successSoft,
    paddingHorizontal: Spacing.m,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  aiInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentSoft,
    padding: Spacing.m,
    borderRadius: Radius.m,
  },
  queueCard: {
    padding: Spacing.l,
  },
  queueStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.m,
    paddingTop: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  upcomingCard: {
    overflow: 'hidden',
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
  },
  upcomingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  upcomingInfo: {
    flex: 1,
  },
  cStatusBadge: {
    paddingHorizontal: Spacing.m,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
});
