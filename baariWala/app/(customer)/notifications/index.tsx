import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';

const NOTIFICATIONS = [
  { id: 'n1', title: 'Your turn is coming up!', body: 'You are currently next in line at Style Zone Salon. Please head over.', time: 'Just now', unread: true },
  { id: 'n2', title: 'Booking Confirmed', body: 'Your appointment for Haircut & Beard Trim on Jun 12 is confirmed.', time: '2 hours ago', unread: false },
  { id: 'n3', title: 'Weekend Special: 20% Off', body: 'Treat yourself this weekend. Use code WEEKEND20 for 20% off all spa services.', time: 'Yesterday', unread: false },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.m) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {NOTIFICATIONS.map((notif, index) => (
          <Animated.View key={notif.id} entering={FadeInDown.duration(400).delay(index * 100)}>
            <TouchableOpacity style={[styles.notifCard, notif.unread && styles.notifCardUnread]} activeOpacity={0.7}>
              <View style={styles.iconWrap}>
                <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={notif.unread ? '#fff' : Colors.textPrimary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <Path d="M13.7 21a2 2 0 0 1-3.4 0" />
                </Svg>
                {notif.unread && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
                <Text style={styles.notifBody}>{notif.body}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.m,
    borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: '#fff'
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...Typography.titleL, color: Colors.textPrimary },
  clearBtn: { padding: 8 },
  clearBtnText: { ...Typography.titleS, color: Colors.textSecondary },
  
  scroll: { padding: Spacing.xl, paddingBottom: 100 },

  notifCard: {
    flexDirection: 'row', gap: 16, padding: 20, backgroundColor: '#fff',
    borderRadius: 16, marginBottom: Spacing.m, borderWidth: 1, borderColor: Colors.border,
    ...Shadow.cardSm
  },
  notifCardUnread: {
    borderColor: Colors.textPrimary, borderWidth: 1.5,
  },
  
  iconWrap: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#F6F6F6',
    alignItems: 'center', justifyContent: 'center', position: 'relative'
  },
  unreadDot: {
    position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.error, borderWidth: 2, borderColor: '#fff'
  },
  
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  notifTitle: { ...Typography.titleS, color: Colors.textPrimary, flex: 1, paddingRight: 8 },
  notifTime: { ...Typography.caption, color: Colors.textSecondary },
  notifBody: { ...Typography.bodyS, color: Colors.textSecondary, lineHeight: 20 },
});
