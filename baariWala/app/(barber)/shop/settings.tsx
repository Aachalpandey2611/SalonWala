import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Divider } from '../../../components/ui/Divider';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
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

export default function ShopSettingsScreen() {
  const [autoAccept, setAutoAccept] = useState(true);
  const [queueBuffer, setQueueBuffer] = useState(false);
  const [allowWalkins, setAllowWalkins] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Shop Settings" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Booking & Queue</Text>
          <View style={styles.card}>
            <ToggleRow 
              label="Auto-Accept Bookings" 
              subtitle="Automatically confirm online bookings" 
              value={autoAccept} 
              onChange={setAutoAccept} 
            />
            <Divider />
            <ToggleRow 
              label="Queue Buffer Time" 
              subtitle="Add 5 min buffer between customers" 
              value={queueBuffer} 
              onChange={setQueueBuffer} 
            />
            <Divider />
            <ToggleRow 
              label="Allow Walk-ins" 
              subtitle="Accept walk-ins when fully booked" 
              value={allowWalkins} 
              onChange={setAllowWalkins} 
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Notifications</Text>
          <View style={styles.card}>
            <ToggleRow 
              label="SMS Alerts" 
              subtitle="Send SMS for new bookings" 
              value={smsAlerts} 
              onChange={setSmsAlerts} 
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Danger Zone</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.dangerRow}>
              <Ionicons name="pause-circle-outline" size={20} color={Colors.warning} />
              <Text style={[Typography.bodyM, { color: Colors.warning, marginLeft: Spacing.m, fontWeight: '600' }]}>
                Temporarily Close Shop
              </Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity style={styles.dangerRow}>
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
              <Text style={[Typography.bodyM, { color: Colors.error, marginLeft: Spacing.m, fontWeight: '600' }]}>
                Delete Shop Profile
              </Text>
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
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
  },
});
