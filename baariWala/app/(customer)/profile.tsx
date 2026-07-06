import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadow } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Polyline, Line } from 'react-native-svg';

const MenuItem = ({ icon, label, subtitle, onPress, isDestructive = false }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, isDestructive && { backgroundColor: '#FFF5F7', borderColor: '#F6D9E0' }]}>
      {icon}
    </View>
    <View style={styles.menuTextContent}>
      <Text style={[styles.menuLabel, isDestructive && { color: Colors.error }]}>{label}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={Colors.iconInactive} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="9 18 15 12 9 6" />
    </Svg>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.xl }]} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>Aman Sharma</Text>
            <Text style={styles.userPhone}>+91 98765 43210</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/profile/edit')}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Activity */}
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={styles.cardGroup}>
          <MenuItem 
            label="Wallet & Payments" 
            subtitle="Balance: ₹150"
            icon={
              <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8}>
                <Rect x="2" y="5" width="20" height="14" rx="2" />
                <Path d="M2 10h20M16 14h.01" />
              </Svg>
            }
          />
          <View style={styles.divider} />
          <MenuItem 
            label="Booking History" 
            onPress={() => router.push('/bookings')}
            icon={
              <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8}>
                <Rect x="4" y="5" width="16" height="16" rx="2.5" />
                <Path d="M4 10h16M8 3v4M16 3v4" />
              </Svg>
            }
          />
        </View>

        {/* Section: Settings & Help */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.cardGroup}>
          <MenuItem 
            label="Notifications" 
            onPress={() => router.push('/notifications')}
            icon={
              <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8}>
                <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <Path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </Svg>
            }
          />
          <View style={styles.divider} />
          <MenuItem 
            label="Help & Support" 
            onPress={() => router.push('/support')}
            icon={
              <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8}>
                <Circle cx="12" cy="12" r="10" />
                <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <Path d="M12 17h.01" />
              </Svg>
            }
          />
          <View style={styles.divider} />
          <MenuItem 
            label="About SalonWala" 
            onPress={() => router.push('/about')}
            icon={
              <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8}>
                <Circle cx="12" cy="12" r="10" />
                <Path d="M12 16v-4" />
                <Path d="M12 8h.01" />
              </Svg>
            }
          />
        </View>

        {/* Section: Danger Zone */}
        <View style={[styles.cardGroup, { marginTop: Spacing.xl }]}>
          <MenuItem 
            label="Log Out" 
            isDestructive
            onPress={() => router.replace('/(auth)/login')}
            icon={
              <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.error} strokeWidth={1.8}>
                <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <Polyline points="16 17 21 12 16 7" />
                <Line x1="21" y1="12" x2="9" y2="12" />
              </Svg>
            }
          />
        </View>

        <Text style={styles.version}>App Version 1.0.0</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100, paddingHorizontal: Spacing.xl },

  header: { marginBottom: Spacing.l },
  title: { ...Typography.displayL, color: Colors.textPrimary },

  userCard: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 16,
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14,
    ...Shadow.cardSm,
    marginBottom: Spacing.xxl,
  },
  avatar: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.textPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...Typography.titleM, color: '#fff' },
  userName: { ...Typography.titleM, color: Colors.textPrimary },
  userPhone: { ...Typography.bodyS, color: Colors.textSecondary, marginTop: 2 },
  editBtn: {
    paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.surfaceGrey,
    borderRadius: 8,
  },
  editBtnText: { ...Typography.titleS, fontSize: 12, color: Colors.textPrimary },

  sectionTitle: { ...Typography.titleM, fontSize: 15, color: Colors.textPrimary, marginBottom: 12, marginLeft: 4 },
  
  cardGroup: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 16,
    marginBottom: Spacing.xxl,
    overflow: 'hidden',
    ...Shadow.cardSm,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14,
  },
  menuIcon: {
    width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'
  },
  menuTextContent: { flex: 1 },
  menuLabel: { ...Typography.titleS, color: Colors.textPrimary },
  menuSubtitle: { ...Typography.bodyS, color: Colors.textSecondary, marginTop: 2 },
  
  version: { ...Typography.bodyS, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.m, opacity: 0.5 },
});
