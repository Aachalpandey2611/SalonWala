import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TOP_SERVICES = [
  { id: '1', name: 'Classic Haircut', bookings: 124, revenue: '₹37,200', pct: 60 },
  { id: '2', name: 'Beard Trim & Shape', bookings: 56, revenue: '₹8,400', pct: 25 },
  { id: '3', name: 'Hair Color (Global)', bookings: 12, revenue: '₹9,600', pct: 10 },
  { id: '4', name: 'Hair Wash & Styling', bookings: 8, revenue: '₹1,600', pct: 5 },
];

export default function ServicePerformanceScreen() {
  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Service Performance" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.m }]}>Top Performing Services</Text>
          <View style={styles.card}>
            {TOP_SERVICES.map((srv, index) => (
              <View key={srv.id} style={styles.serviceItem}>
                <View style={styles.serviceRow}>
                  <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600', flex: 1 }]}>
                    {srv.name}
                  </Text>
                  <Text style={[Typography.titleS, { color: Colors.textPrimary }]}>{srv.revenue}</Text>
                </View>
                
                <View style={styles.serviceRow}>
                  <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{srv.bookings} Bookings</Text>
                  <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{srv.pct}% of Total</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progBg}>
                  <View style={[styles.progFill, { width: `${srv.pct}%`, backgroundColor: index === 0 ? Colors.primary : Colors.accent }]} />
                </View>

                {index < TOP_SERVICES.length - 1 && <View style={styles.divider} />}
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
  serviceItem: {
    marginBottom: Spacing.s,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progBg: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    marginTop: Spacing.xs,
    marginBottom: Spacing.s,
  },
  progFill: {
    height: '100%',
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.m,
  },
});
