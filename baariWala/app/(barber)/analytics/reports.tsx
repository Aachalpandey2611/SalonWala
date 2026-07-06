import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ReportCard = ({ title, subtitle, color, delay }: { title: string, subtitle: string, color: string, delay: number }) => (
  <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.textCol}>
          <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>{title}</Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 2 }]}>{subtitle}</Text>
        </View>
        <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
          <Ionicons name="document-text" size={24} color={color} />
        </View>
      </View>
      
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="download-outline" size={18} color={Colors.primary} />
          <Text style={[Typography.label, { color: Colors.primary, marginLeft: 6 }]}>Download CSV</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="print-outline" size={18} color={Colors.textSecondary} />
          <Text style={[Typography.label, { color: Colors.textSecondary, marginLeft: 6 }]}>Print</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Animated.View>
);

export default function ReportsScreen() {
  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Generate Reports" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <ReportCard title="Daily Report" subtitle="Earnings, bookings, and walk-ins for today" color={Colors.success} delay={0} />
        <ReportCard title="Weekly Summary" subtitle="Performance metrics for the last 7 days" color={Colors.primary} delay={100} />
        <ReportCard title="Monthly Statement" subtitle="Complete financial and operational statement" color={Colors.warning} delay={200} />
        <ReportCard title="Custom Range" subtitle="Select specific dates to generate report" color={Colors.accent} delay={300} />

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.l,
    paddingBottom: Spacing.xxxxxl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    marginBottom: Spacing.l,
    ...Shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  textCol: {
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.m,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.m,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderSubtle,
  },
});
