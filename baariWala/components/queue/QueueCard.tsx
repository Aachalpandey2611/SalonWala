import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Booking } from '../../data/bookings';
import { StatusBadge } from './StatusBadge';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface QueueCardProps {
  booking: Booking;
  index?: number;
  onPress?: (booking: Booking) => void;
  onRebook?: (booking: Booking) => void;
}

export const QueueCard: React.FC<QueueCardProps> = ({ booking, index = 0, onPress, onRebook }) => {
  const isActive = ['waiting', 'approaching', 'called', 'serving', 'standby'].includes(booking.status);

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(index * 80)}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress && onPress(booking)}
        style={styles.card}
      >
        {/* Top Row */}
        <View style={styles.topRow}>
          <View style={styles.shopInfo}>
            <Text style={[Typography.titleS, { color: Colors.textPrimary }]} numberOfLines={1}>
              {booking.shopName}
            </Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 2 }]}>
              {booking.service} · {booking.barberName}
            </Text>
          </View>
          <StatusBadge status={booking.status} />
        </View>

        {/* Date/Time Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textTertiary} />
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>
              {booking.date}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={Colors.textTertiary} />
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>
              {booking.time}
            </Text>
          </View>
          <Text style={[Typography.titleS, { color: Colors.textPrimary }]}>
            ₹{booking.price}
          </Text>
        </View>

        {/* Active Queue Info */}
        {isActive && booking.status === 'waiting' && (
          <View style={styles.queueInfo}>
            <View style={styles.tokenPill}>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Token</Text>
              <Text style={[Typography.titleM, { color: Colors.accent, fontWeight: '700' }]}>
                #{booking.tokenNumber}
              </Text>
            </View>
            <View style={styles.tokenPill}>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Wait</Text>
              <Text style={[Typography.titleM, { color: Colors.textPrimary, fontWeight: '700' }]}>
                {booking.estimatedWaitMins}m
              </Text>
            </View>
            <View style={styles.tokenPill}>
              <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Ahead</Text>
              <Text style={[Typography.titleM, { color: Colors.textPrimary, fontWeight: '700' }]}>
                {booking.peopleAhead}
              </Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {isActive ? (
            <Text style={[Typography.label, { color: Colors.accent, fontWeight: '600' }]}>
              Track Live →
            </Text>
          ) : (
            <TouchableOpacity onPress={() => onRebook && onRebook(booking)}>
              <Text style={[Typography.label, { color: Colors.primary, fontWeight: '600' }]}>
                Rebook
              </Text>
            </TouchableOpacity>
          )}
          <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    ...Shadow.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.m,
  },
  shopInfo: {
    flex: 1,
    marginRight: Spacing.m,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.l,
  },
  queueInfo: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.m,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    justifyContent: 'space-around',
  },
  tokenPill: {
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: Spacing.m,
  },
});
