import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';
import Animated, { 
  useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing, 
  withSequence, withSpring, runOnJS, useAnimatedProps
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DUMMY_BOOKINGS } from '../../../data/bookings';
import { useRouter } from 'expo-router';

// Reanimated component for the SVG Path to draw the checkmark stroke
const AnimatedPath = Animated.createAnimatedComponent(Path);

const TokenFlipReveal = ({ token }: { token: number }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(1);
  const checkProgress = useSharedValue(0); // 0 to 1

  useEffect(() => {
    // 1. Flip down the blank flap
    rotation.value = withDelay(200, withTiming(-180, { duration: 700, easing: Easing.bezier(0.45, 0, 0.2, 1) }));
    opacity.value = withDelay(200, withTiming(0, { duration: 700, easing: Easing.bezier(0.45, 0, 0.2, 1) }));
    
    // 2. Scale bounce the whole container as it lands
    scale.value = withDelay(800, withSequence(
      withTiming(1.1, { duration: 150, easing: Easing.out(Easing.ease) }),
      withSpring(1, { damping: 12, stiffness: 100 })
    ));

    // 3. Draw the checkmark exactly as it lands
    checkProgress.value = withDelay(800, withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }));
  }, []);

  const flapStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { translateY: -60 },
      { rotateX: `${rotation.value}deg` },
      { translateY: 60 },
    ],
    opacity: opacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const checkAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 100 - (checkProgress.value * 100),
  }));

  const tokenStr = `#${token < 10 ? `0${token}` : token}`;

  return (
    <Animated.View style={[styles.tokenRevealContainer, containerStyle]}>
      {/* The Checkmark that draws itself */}
      <View style={styles.checkCircle}>
        <Svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke={Colors.success} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <AnimatedPath 
            d="M20 6 9 17l-5-5" 
            strokeDasharray={100}
            animatedProps={checkAnimatedProps}
          />
        </Svg>
      </View>
      
      <Text style={styles.confirmedText}>Booking Confirmed!</Text>

      {/* The Flip Display */}
      <View style={styles.flipWrapper}>
        <View style={styles.flipBase}>
          <Text style={styles.flipNumber}>{tokenStr}</Text>
        </View>
        <Animated.View style={[styles.flapTop, flapStyle]} />
      </View>

      <Text style={styles.tokenLabel}>Your Token Number</Text>
    </Animated.View>
  );
};

export default function UnifiedQueueScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const booking = DUMMY_BOOKINGS[0]; // the active one

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.xl }]}>
        
        {/* The Master Reveal Moment */}
        <TokenFlipReveal token={booking.tokenNumber} />

        {/* Live Status Section */}
        <View style={styles.cardGroup}>
          <View style={styles.liveHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
            </View>
            <Text style={styles.liveText}>Live Queue Status</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Currently Serving</Text>
              <Text style={styles.statValue}>#{booking.currentServingToken < 10 ? `0${booking.currentServingToken}` : booking.currentServingToken}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Estimated Wait</Text>
              <Text style={styles.statValue}>{booking.estimatedWaitMins} min</Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <Text style={styles.sectionTitle}>Booking Details</Text>
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
            <Text style={styles.detailValue}>₹{booking.price}</Text>
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
        
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelBtnText}>Cancel Booking</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100, paddingHorizontal: Spacing.xl },

  tokenRevealContainer: {
    alignItems: 'center', marginVertical: Spacing.xl,
  },
  checkCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.m, ...Shadow.cardSm,
  },
  confirmedText: { ...Typography.titleM, color: Colors.textPrimary, marginBottom: Spacing.l },
  
  flipWrapper: {
    height: 120, width: 140, position: 'relative', marginBottom: Spacing.m,
  },
  flipBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.textPrimary, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.card,
  },
  flapTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
    backgroundColor: '#1c1c1c', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    backfaceVisibility: 'hidden', zIndex: 10,
  },
  flipNumber: { ...Typography.displayXL, fontSize: 56, color: '#fff', letterSpacing: -2 },
  tokenLabel: { ...Typography.titleS, color: Colors.textSecondary },

  sectionTitle: { ...Typography.titleM, fontSize: 15, color: Colors.textPrimary, marginBottom: 12, marginLeft: 4, marginTop: Spacing.l },
  cardGroup: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 16,
    overflow: 'hidden', ...Shadow.cardSm,
  },
  divider: { height: 1, backgroundColor: Colors.border },

  liveHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, backgroundColor: '#FAFAFA' },
  liveIndicator: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(46, 158, 91, 0.2)', alignItems: 'center', justifyContent: 'center' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  liveText: { ...Typography.titleS, color: Colors.textPrimary },

  statsRow: { flexDirection: 'row', paddingVertical: 16 },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.border },
  statLabel: { ...Typography.bodyS, color: Colors.textSecondary, marginBottom: 4 },
  statValue: { ...Typography.displayM, color: Colors.textPrimary },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  detailLabel: { ...Typography.bodyM, color: Colors.textSecondary },
  detailValue: { ...Typography.titleS, color: Colors.textPrimary },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: Spacing.xxl, marginBottom: Spacing.l },
  actionBtn: {
    flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8,
    ...Shadow.cardSm,
  },
  actionText: { ...Typography.titleS, color: Colors.textPrimary },
  
  cancelBtn: { alignItems: 'center', paddingVertical: 16 },
  cancelBtnText: { ...Typography.titleS, color: Colors.error },
});
