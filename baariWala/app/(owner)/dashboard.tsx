import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../../components/ui/Avatar';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { AmbientBackground } from '../../components/ui/AmbientBackground';
import { GlassCard } from '../../components/ui/GlassCard';

const { width } = Dimensions.get('window');

// --- SIGNATURE ELEMENT: BUSINESS HEALTH ORB ---
const HealthOrb = ({ health }: { health: 'excellent' | 'good' | 'warning' }) => {
  const scale = useSharedValue(1);
  const pulse = useSharedValue(0.5);

  const colors = {
    excellent: { core: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' },
    good: { core: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)' },
    warning: { core: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)' },
  };
  const activeColor = colors[health];

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
    scale.value = withRepeat(withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowColor: activeColor.core,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: pulse.value,
    shadowRadius: 20,
    elevation: pulse.value * 20,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.5 }],
    opacity: pulse.value * 0.6,
  }));

  return (
    <View style={styles.orbContainer}>
      <Animated.View style={[styles.orbGlow, glowStyle, { backgroundColor: activeColor.glow }]} />
      <Animated.View style={[styles.orbCore, orbStyle, { backgroundColor: activeColor.core }]}>
        <Ionicons 
          name={health === 'excellent' ? 'flash' : health === 'good' ? 'pulse' : 'warning'} 
          size={24} 
          color={Colors.surface} 
        />
      </Animated.View>
      <View style={styles.orbInfo}>
        <Text style={styles.orbTitle}>Business Health</Text>
        <Text style={[styles.orbStatus, { color: activeColor.core }]}>
          {health === 'excellent' ? 'Optimal Flow' : health === 'good' ? 'Busy but stable' : 'High Wait Times'}
        </Text>
      </View>
    </View>
  );
};

const MetricCard = ({ title, value, subtitle, icon, color, delay, trend, trendUp }: any) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(delay)} style={[styles.metricCard, animStyle]}>
      <Pressable onPressIn={() => { scale.value = withSpring(0.96); }} onPressOut={() => { scale.value = withSpring(1); }} style={styles.metricInner}>
        <View style={[styles.metricIcon, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text style={[Typography.displayM, styles.metricValue]}>{value}</Text>
        <Text style={styles.metricTitle}>{title}</Text>
        <View style={styles.metricFooter}>
          <Text style={styles.metricSub}>{subtitle}</Text>
          {trend && (
            <View style={[styles.trendPill, { backgroundColor: trendUp ? Colors.successSoft : Colors.errorSoft }]}>
              <Ionicons name={trendUp ? 'trending-up' : 'trending-down'} size={10} color={trendUp ? Colors.success : Colors.error} />
              <Text style={[styles.trendText, { color: trendUp ? Colors.success : Colors.error }]}>{trend}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const SimulatedChart = () => (
  <View style={styles.chartArea}>
    <View style={styles.chartLine} />
    <View style={styles.chartLabels}>
      {['9am','11am','1pm','3pm','5pm','7pm'].map(l => (
        <Text key={l} style={styles.chartLabelText}>{l}</Text>
      ))}
    </View>
  </View>
);

export default function OwnerDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Live' | 'Insights'>('Live');

  return (
    <View style={styles.screen}>
      <AmbientBackground />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Dynamic Hero Section */}
        <Animated.View entering={FadeInDown.duration(600)} style={[styles.hero, { paddingTop: insets.top + Spacing.m }]}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.greeting}>Good Afternoon,</Text>
              <Text style={styles.shopName}>Style Zone Salon</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(owner)/profile')}>
              <Avatar size={44} initials="SZ" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <HealthOrb health="excellent" />

        {/* Segmented Control */}
        <View style={styles.segmentContainer}>
          {(['Live', 'Insights'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.segment, activeTab === tab && styles.segmentActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.segmentText, activeTab === tab && styles.segmentTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Live' ? (
          /* ===== LIVE OPERATIONS VIEW ===== */
          <Animated.View entering={FadeInRight.duration(400)}>
            {/* Nav Grid */}
            <View style={styles.navGrid}>
              {[
                { label: 'Team', icon: 'people', route: '/(owner)/staff', color: Colors.primary },
                { label: 'Queues', icon: 'list', route: '/(owner)/queues', color: Colors.warning },
                { label: 'Services', icon: 'briefcase', route: '/(owner)/services', color: Colors.info },
              ].map((nav, i) => (
                <TouchableOpacity key={nav.label} style={styles.navItem} onPress={() => router.push(nav.route as any)}>
                  <View style={[styles.navIconBox, { backgroundColor: nav.color + '18' }]}>
                    <Ionicons name={nav.icon as any} size={22} color={nav.color} />
                  </View>
                  <Text style={styles.navLabel}>{nav.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Today's Metrics</Text>
            <View style={styles.metricsGrid}>
              <MetricCard title="Revenue" value="₹12,450" subtitle="Today" icon="cash-outline" color={Colors.success} delay={100} trend="12%" trendUp={true} />
              <MetricCard title="Wait Time" value="18m" subtitle="Avg today" icon="time-outline" color={Colors.warning} delay={200} trend="4m" trendUp={false} />
              <MetricCard title="Completed" value="48" subtitle="Customers" icon="checkmark-circle-outline" color={Colors.primary} delay={300} trend="+8" trendUp={true} />
              <MetricCard title="In Queue" value="12" subtitle="Right now" icon="people-outline" color={Colors.accent} delay={400} />
            </View>
          </Animated.View>
        ) : (
          /* ===== BUSINESS INSIGHTS VIEW ===== */
          <Animated.View entering={FadeInRight.duration(400)}>
            <View style={styles.insightsCard}>
              <Text style={styles.cardHeader}>Monthly Revenue</Text>
              <Text style={styles.bigVal}>₹2,48,400</Text>
              <View style={styles.growthBadge}>
                <Ionicons name="trending-up" size={14} color={Colors.success} />
                <Text style={styles.growthText}>+24% vs Last Month</Text>
              </View>
              <SimulatedChart />
            </View>

            <View style={styles.insightsRow}>
              <View style={[styles.insightsCard, { flex: 1 }]}>
                <Text style={styles.cardHeader}>Top Service</Text>
                <Ionicons name="cut" size={24} color={Colors.primary} style={{ marginVertical: 8 }} />
                <Text style={styles.metricVal}>Haircut</Text>
                <Text style={styles.subText}>42% of revenue</Text>
              </View>
              <View style={[styles.insightsCard, { flex: 1 }]}>
                <Text style={styles.cardHeader}>Peak Hours</Text>
                <Ionicons name="time" size={24} color={Colors.warning} style={{ marginVertical: 8 }} />
                <Text style={styles.metricVal}>5 PM - 8 PM</Text>
                <Text style={styles.subText}>Weekends</Text>
              </View>
            </View>
          </Animated.View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  hero: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { ...Typography.bodyM, color: Colors.textSecondary },
  shopName: { ...Typography.titleL, color: Colors.textPrimary, fontWeight: '800', marginTop: 2 },
  
  orbContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.xl, marginBottom: Spacing.xl, backgroundColor: Colors.surface, padding: Spacing.l, borderRadius: Radius.xl, ...Shadow.card },
  orbGlow: { position: 'absolute', left: Spacing.l, width: 48, height: 48, borderRadius: 24 },
  orbCore: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  orbInfo: { marginLeft: Spacing.xl },
  orbTitle: { ...Typography.caption, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  orbStatus: { ...Typography.titleS, fontWeight: '800', marginTop: 2 },

  segmentContainer: { flexDirection: 'row', marginHorizontal: Spacing.xl, marginBottom: Spacing.xl, backgroundColor: Colors.surface, borderRadius: Radius.l, padding: 4, ...Shadow.card },
  segment: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.m },
  segmentActive: { backgroundColor: Colors.primarySoft },
  segmentText: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  segmentTextActive: { color: Colors.primary, fontWeight: '700' },

  navGrid: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: Spacing.m, marginBottom: Spacing.xxl },
  navItem: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.l, padding: Spacing.m, alignItems: 'center', ...Shadow.card },
  navIconBox: { width: 44, height: 44, borderRadius: Radius.m, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.s },
  navLabel: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600' },

  sectionTitle: { ...Typography.titleM, color: Colors.textPrimary, fontWeight: '800', marginHorizontal: Spacing.xl, marginBottom: Spacing.m },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.xl, gap: Spacing.m },
  metricCard: { width: (width - Spacing.xl * 2 - Spacing.m) / 2, backgroundColor: Colors.surface, borderRadius: Radius.xl, ...Shadow.card, overflow: 'hidden' },
  metricInner: { padding: Spacing.l },
  metricIcon: { width: 32, height: 32, borderRadius: Radius.s, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.m },
  metricValue: { fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  metricTitle: { ...Typography.bodyS, color: Colors.textSecondary, fontWeight: '600', marginBottom: 12 },
  metricFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: Colors.borderSubtle, paddingTop: Spacing.s },
  metricSub: { ...Typography.caption, color: Colors.textTertiary, fontSize: 10 },
  trendPill: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  trendText: { ...Typography.caption, fontSize: 9, fontWeight: '700' },

  insightsCard: { marginHorizontal: Spacing.xl, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.m, ...Shadow.card },
  insightsRow: { flexDirection: 'row', marginHorizontal: Spacing.xl, gap: Spacing.m },
  cardHeader: { ...Typography.caption, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.s },
  bigVal: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary },
  growthBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: Colors.successSoft, paddingHorizontal: Spacing.s, paddingVertical: 4, borderRadius: Radius.full, marginTop: Spacing.xs, marginBottom: Spacing.xl },
  growthText: { ...Typography.caption, color: Colors.success, fontWeight: '700', marginLeft: 4 },
  
  metricVal: { ...Typography.titleS, color: Colors.textPrimary, fontWeight: '700' },
  subText: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },

  chartArea: { height: 120, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle, justifyContent: 'center' },
  chartLine: { height: 40, borderBottomWidth: 3, borderBottomColor: Colors.primary, width: '80%', alignSelf: 'center', transform: [{ rotate: '-10deg' }] },
  chartLabels: { position: 'absolute', bottom: -20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between' },
  chartLabelText: { fontSize: 9, color: Colors.textTertiary },
});
