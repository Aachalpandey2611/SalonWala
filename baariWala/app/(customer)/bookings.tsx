import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const MOCK_UPCOMING = [
  {
    id: 'b1',
    shopName: 'Style Zone Salon',
    service: 'Haircut',
    token: '#07',
    date: 'Today, 4:30 PM',
    status: 'upcoming'
  }
];

const MOCK_PAST = [
  {
    id: 'b2',
    shopName: 'Urban Fade Barbershop',
    service: 'Haircut & Beard Trim',
    token: '#42',
    date: 'Jun 12, 2026',
    price: '₹349',
    status: 'completed'
  },
  {
    id: 'b3',
    shopName: 'Elite Grooming Lounge',
    service: 'Hair Spa',
    token: '#11',
    date: 'May 28, 2026',
    price: '₹499',
    status: 'completed'
  }
];

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const renderCard = (booking: any, isPast: boolean) => (
    <TouchableOpacity 
      key={booking.id} 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => router.push(`/bookings/${booking.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{booking.shopName}</Text>
          <Text style={styles.serviceName}>{booking.service}</Text>
        </View>
        <View style={styles.tokenBadge}>
          <Text style={styles.tokenText}>{booking.token}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.cardFooter}>
        <View style={styles.dateRow}>
          <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={Colors.iconInactive} strokeWidth={2}>
            <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <Path d="M16 2v4M8 2v4M3 10h18" />
          </Svg>
          <Text style={styles.dateText}>{booking.date}</Text>
        </View>
        
        {isPast ? (
          <View style={styles.statusBadgeGray}>
            <Text style={styles.statusTextGray}>Completed</Text>
          </View>
        ) : (
          <View style={styles.statusBadgeGreen}>
            <Circle cx="4" cy="10" r="3" fill={Colors.success} />
            <Text style={styles.statusTextGreen}>Upcoming</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xl }]}>
        <Text style={styles.title}>Bookings</Text>
        
        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity 
            style={[styles.segmentBtn, activeTab === 'upcoming' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('upcoming')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'upcoming' && styles.segmentTextActive]}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.segmentBtn, activeTab === 'past' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('past')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'past' && styles.segmentTextActive]}>Past</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'upcoming' ? (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            {MOCK_UPCOMING.length > 0 ? (
              MOCK_UPCOMING.map(b => renderCard(b, false))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No upcoming bookings.</Text>
              </View>
            )}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            {MOCK_PAST.map(b => renderCard(b, true))}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, backgroundColor: '#fff', paddingBottom: Spacing.l, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { ...Typography.displayL, color: Colors.textPrimary, marginBottom: Spacing.l },
  
  segmentedControl: {
    flexDirection: 'row', backgroundColor: '#F6F6F6', borderRadius: 12, padding: 4,
  },
  segmentBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#fff', ...Shadow.cardSm,
  },
  segmentText: {
    ...Typography.titleS, color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: Colors.textPrimary,
  },

  scroll: { padding: Spacing.xl, paddingBottom: 100 },
  
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: Spacing.m,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.cardSm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  shopInfo: { flex: 1, paddingRight: 12 },
  shopName: { ...Typography.titleM, color: Colors.textPrimary, marginBottom: 4 },
  serviceName: { ...Typography.bodyM, color: Colors.textSecondary },
  
  tokenBadge: { backgroundColor: '#F6F6F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  tokenText: { ...Typography.titleM, color: Colors.textPrimary },
  
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateText: { ...Typography.bodyM, color: Colors.textPrimary, fontWeight: '500' },
  
  statusBadgeGreen: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  statusTextGreen: { ...Typography.caption, color: Colors.success, marginLeft: 12, fontWeight: '600' },
  
  statusBadgeGray: { backgroundColor: '#F6F6F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  statusTextGray: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  
  emptyState: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { ...Typography.bodyM, color: Colors.iconInactive },
});
