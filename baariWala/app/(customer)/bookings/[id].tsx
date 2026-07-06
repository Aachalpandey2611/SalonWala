import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';

export default function BookingDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  
  // Use a hardcoded mock booking for demo purposes
  const booking = {
    shopName: id === 'b1' ? 'Style Zone Salon' : 'Urban Fade Barbershop',
    service: id === 'b1' ? 'Haircut' : 'Haircut & Beard Trim',
    price: id === 'b1' ? '₹199' : '₹349',
    bookingRef: `BW-${Math.floor(Math.random() * 10000)}`,
    status: id === 'b1' ? 'Upcoming' : 'Completed',
    date: id === 'b1' ? 'Today, 4:30 PM' : 'Jun 12, 2026'
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.m) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.title}>Booking Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Receipt Header */}
        <View style={styles.receiptHeader}>
          <View style={styles.checkCircle}>
            <Svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke={Colors.success} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M20 6 9 17l-5-5" />
            </Svg>
          </View>
          <Text style={styles.confirmedText}>{booking.status}</Text>
          <Text style={styles.dateText}>{booking.date}</Text>
        </View>

        {/* Booking Details Card */}
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.cardGroup}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Shop</Text>
            <Text style={styles.detailValue}>{booking.shopName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{booking.service}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValue}>{booking.price}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValue}>{booking.bookingRef}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8}>
              <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </Svg>
            <Text style={styles.actionText}>Call Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8}>
              <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </Svg>
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>
        </View>
        
        {booking.status === 'Upcoming' && (
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
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

  receiptHeader: { alignItems: 'center', marginVertical: Spacing.xl },
  checkCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.m, ...Shadow.cardSm,
  },
  confirmedText: { ...Typography.titleM, color: Colors.textPrimary, marginBottom: 4 },
  dateText: { ...Typography.bodyM, color: Colors.textSecondary },

  sectionTitle: { ...Typography.titleM, color: Colors.textPrimary, marginBottom: Spacing.m },
  cardGroup: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.xl, ...Shadow.cardSm,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { ...Typography.bodyM, color: Colors.textSecondary },
  detailValue: { ...Typography.bodyM, color: Colors.textPrimary, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 },

  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#F6F6F6', paddingVertical: 14, borderRadius: 12,
  },
  actionText: { ...Typography.titleS, color: Colors.textPrimary },

  cancelBtn: { alignItems: 'center', paddingVertical: 14 },
  cancelBtnText: { ...Typography.titleS, color: Colors.error },
});
