import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SettingToggle = ({ label, description, isEnabled, onToggle }: any) => (
  <View style={styles.settingRow}>
    <View style={{ flex: 1, paddingRight: 16 }}>
      <Text style={styles.settingLabel}>{label}</Text>
      {description && <Text style={styles.settingDesc}>{description}</Text>}
    </View>
    <Switch 
      value={isEnabled} 
      onValueChange={onToggle}
      trackColor={{ false: Colors.border, true: Colors.textPrimary }}
      thumbColor="#fff"
    />
  </View>
);

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [settings, setSettings] = useState({
    push: true,
    sms: false,
    email: true,
    location: true,
    dark: false
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.m) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.cardGroup}>
            <SettingToggle 
              label="Push Notifications" 
              description="Receive updates about your queue status and booking reminders."
              isEnabled={settings.push} 
              onToggle={() => toggle('push')} 
            />
            <View style={styles.divider} />
            <SettingToggle 
              label="SMS Alerts" 
              description="Get text messages for important booking updates."
              isEnabled={settings.sms} 
              onToggle={() => toggle('sms')} 
            />
            <View style={styles.divider} />
            <SettingToggle 
              label="Email Promotions" 
              description="Receive weekly offers and grooming tips."
              isEnabled={settings.email} 
              onToggle={() => toggle('email')} 
            />
          </View>

          <Text style={styles.sectionTitle}>App Preferences</Text>
          <View style={styles.cardGroup}>
            <SettingToggle 
              label="Location Services" 
              description="Allow SalonWala to show the nearest salons."
              isEnabled={settings.location} 
              onToggle={() => toggle('location')} 
            />
            <View style={styles.divider} />
            <SettingToggle 
              label="Dark Mode" 
              description="Coming soon to a future update."
              isEnabled={settings.dark} 
              onToggle={() => {}} 
            />
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.m,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...Typography.titleL, color: Colors.textPrimary },
  scroll: { padding: Spacing.xl, paddingBottom: 100 },

  sectionTitle: { ...Typography.titleM, color: Colors.textPrimary, marginBottom: Spacing.m },
  cardGroup: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.xl, ...Shadow.cardSm,
  },
  
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  settingLabel: { ...Typography.titleS, color: Colors.textPrimary, marginBottom: 4 },
  settingDesc: { ...Typography.bodyS, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 16 },
});
