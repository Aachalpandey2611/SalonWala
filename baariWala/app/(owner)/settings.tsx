import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Divider } from '../../components/ui/Divider';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ToggleRowProps {
  label: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, subtitle, value, onChange }) => (
  <View style={styles.toggleRow}>
    <View style={styles.toggleTextBox}>
      <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '500' }]}>{label}</Text>
      {subtitle && <Text style={[Typography.caption, { color: Colors.textTertiary, marginTop: 2 }]}>{subtitle}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: Colors.borderSubtle, true: Colors.accent }}
      thumbColor={Colors.surface}
    />
  </View>
);

export default function BusinessSettingsScreen() {
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  const [allowCancellations, setAllowCancellations] = useState(true);
  const [staffNotifications, setStaffNotifications] = useState(true);

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Business Settings" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Shop Level Rules</Text>
          <View style={styles.card}>
            <ToggleRow 
              label="Enable Online Booking" 
              subtitle="Customers can book via SalonWala app" 
              value={onlineBooking} 
              onChange={setOnlineBooking} 
            />
            <Divider />
            <ToggleRow 
              label="Auto-Assign Walk-ins" 
              subtitle="Distribute walk-ins to free barbers" 
              value={autoAssign} 
              onChange={setAutoAssign} 
            />
            <Divider />
            <ToggleRow 
              label="Allow Cancellations" 
              subtitle="Up to 2 hours before appointment" 
              value={allowCancellations} 
              onChange={setAllowCancellations} 
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Team Notifications</Text>
          <View style={styles.card}>
            <ToggleRow 
              label="Staff Alerts" 
              subtitle="Send SMS to staff for new bookings" 
              value={staffNotifications} 
              onChange={setStaffNotifications} 
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Preferences</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.navRow}>
              <Text style={[Typography.bodyM, { color: Colors.textPrimary }]}>App Theme</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginRight: 4 }]}>System</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
              </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity style={styles.navRow}>
              <Text style={[Typography.bodyM, { color: Colors.textPrimary }]}>Language</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginRight: 4 }]}>English</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
              </View>
            </TouchableOpacity>
          </View>
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
  sectionLabel: {
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.s,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    overflow: 'hidden',
    ...Shadow.card,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.l,
  },
  toggleTextBox: {
    flex: 1,
    marginRight: Spacing.m,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.l,
  },
});
