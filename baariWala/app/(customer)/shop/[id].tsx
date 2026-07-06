import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../../constants/theme';
import { DUMMY_SERVICES } from '../../../data/services';
import { DUMMY_BARBERS } from '../../../data/barbers';
import { DUMMY_SHOPS } from '../../../data/shops';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');

// The Signature Motif: Split-flap price reveal
const PriceFlap = ({ price }: { price: number }) => {
  const [displayPrice, setDisplayPrice] = useState(price);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);
  const baseScale = useSharedValue(1);

  useEffect(() => {
    if (price !== displayPrice) {
      // Trigger flip
      rotation.value = 0;
      opacity.value = 1;
      baseScale.value = 1;
      
      // Animate flap down
      rotation.value = withTiming(-180, { duration: 500, easing: Easing.bezier(0.45, 0, 0.2, 1) }, (finished) => {
        if (finished) {
          runOnJS(setDisplayPrice)(price);
        }
      });
      opacity.value = withTiming(0, { duration: 500, easing: Easing.bezier(0.45, 0, 0.2, 1) });
      
      // Subtle bounce on land
      baseScale.value = withDelay(400, withTiming(1.05, { duration: 150 }, () => {
        baseScale.value = withTiming(1, { duration: 150 });
      }));
    }
  }, [price]);

  const flapStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { translateY: -12 }, // half height of the text area approx
      { rotateX: `${rotation.value}deg` },
      { translateY: 12 },
    ],
    opacity: opacity.value,
  }));

  const baseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: baseScale.value }]
  }));

  return (
    <Animated.View style={[{ position: 'relative', overflow: 'visible', alignItems: 'flex-start', justifyContent: 'center' }, baseStyle]}>
      {/* Base showing the new price (hidden under flap initially) */}
      <View style={{ backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
         <Text style={{ ...Typography.titleL, color: '#fff', fontSize: 20 }}>₹{price}</Text>
      </View>
      
      {/* The Flap showing the old price falling away */}
      <Animated.View style={[
        { position: 'absolute', top: 0, left: 0, backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backfaceVisibility: 'hidden', zIndex: 10 },
        flapStyle
      ]}>
        <Text style={{ ...Typography.titleL, color: '#fff', fontSize: 20 }}>₹{displayPrice}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default function ShopDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const shop = DUMMY_SHOPS.find(s => s.id === id) || DUMMY_SHOPS[0];
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  const toggleService = (srvId: string) => {
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (next.has(srvId)) next.delete(srvId);
      else next.add(srvId);
      return next;
    });
  };

  const totalPrice = Array.from(selectedServices).reduce((sum, srvId) => {
    const srv = DUMMY_SERVICES.find(s => s.id === srvId);
    return sum + (srv?.price || 0);
  }, 0);

  const handleBook = () => {
    // Proceed directly to confirmation/live status screen
    // Since we are merging book and queue
    router.replace('/(customer)/queue/my-queue');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}>
        
        {/* Header (Minimal, white bg) */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.m) }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M19 12H5M12 19l-7-7 7-7" />
            </Svg>
          </TouchableOpacity>
          <View style={styles.rightControls}>
            <TouchableOpacity style={[styles.iconBtn, { marginRight: Spacing.s }]}>
              <Svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <Circle cx="18" cy="5" r="3" />
                <Circle cx="6" cy="12" r="3" />
                <Circle cx="18" cy="19" r="3" />
                <Path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image source={{ uri: shop.imageUrl }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.openBadge}>
            <View style={styles.openDot} />
            <Text style={styles.openText}>{shop.isOpen ? 'Open Now' : 'Closed'}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.shopName}>{shop.name}</Text>
            <View style={styles.ratingBadge}>
              <Svg viewBox="0 0 24 24" width={12} height={12} fill={Colors.textPrimary} stroke="none">
                <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </Svg>
              <Text style={styles.ratingText}>{shop.rating}</Text>
            </View>
          </View>
          <Text style={styles.addressText}>{shop.address} • {shop.distance}</Text>
        </View>

        {/* Services Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Services</Text>
          {DUMMY_SERVICES.map((srv) => {
            const isSelected = selectedServices.has(srv.id);
            return (
              <TouchableOpacity 
                key={srv.id} 
                style={[styles.serviceCard, isSelected && styles.serviceCardActive]} 
                onPress={() => toggleService(srv.id)}
                activeOpacity={0.8}
              >
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{srv.name}</Text>
                  <Text style={styles.serviceDesc}>{srv.duration} mins</Text>
                  <Text style={styles.servicePrice}>₹{srv.price}</Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                  {isSelected && (
                    <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <Polyline points="20 6 9 17 4 12" />
                    </Svg>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Specialists (Optional selection, just visual for now) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Specialists</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.barbersList}>
            {DUMMY_BARBERS.map((barber) => (
              <View key={barber.id} style={styles.barberCard}>
                <Image source={{ uri: barber.imageUrl }} style={styles.barberImg} contentFit="cover" />
                <View style={styles.barberInfo}>
                  <Text style={styles.barberName} numberOfLines={1}>{barber.name}</Text>
                  <Text style={styles.barberRatingText}>⭐ {barber.rating}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Booking Footer - Appears when services are selected */}
      {selectedServices.size > 0 && (
        <Animated.View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.footerContent}>
            <View>
              <Text style={styles.footerLabel}>Total Amount</Text>
              <PriceFlap price={totalPrice} />
            </View>
            <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
              <Text style={styles.bookBtnText}>Book Now</Text>
              <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M5 12h14M12 5l7 7-7 7" />
              </Svg>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 40 },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, backgroundColor: Colors.background,
    paddingBottom: Spacing.m,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.cardSm,
  },
  rightControls: { flexDirection: 'row' },

  heroSection: { marginHorizontal: Spacing.xl, position: 'relative', marginBottom: Spacing.l },
  heroImage: { width: '100%', height: 220, borderRadius: 16 },
  openBadge: {
    position: 'absolute', top: 12, left: 12, backgroundColor: '#fff',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  openDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  openText: { ...Typography.titleS, fontSize: 11, color: Colors.textPrimary },

  infoSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.xxl },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  shopName: { ...Typography.displayL, fontSize: 24, color: Colors.textPrimary, flex: 1, marginRight: 16 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
    ...Shadow.cardSm,
  },
  ratingText: { ...Typography.titleS, fontSize: 12, color: Colors.textPrimary },
  addressText: { ...Typography.bodyM, color: Colors.textSecondary },

  section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.xxl },
  sectionTitle: { ...Typography.titleL, color: Colors.textPrimary, marginBottom: Spacing.m },
  
  serviceCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    padding: Spacing.l, borderRadius: 16,
    marginBottom: Spacing.m,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.cardSm,
  },
  serviceCardActive: { borderColor: Colors.textPrimary },
  serviceInfo: { flex: 1 },
  serviceName: { ...Typography.titleM, color: Colors.textPrimary },
  serviceDesc: { ...Typography.bodyS, color: Colors.textSecondary, marginTop: 2, marginBottom: 6 },
  servicePrice: { ...Typography.titleS, color: Colors.textPrimary },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: Colors.iconInactive,
    alignItems: 'center', justifyContent: 'center'
  },
  checkboxActive: { backgroundColor: Colors.textPrimary, borderColor: Colors.textPrimary },

  barbersList: { gap: Spacing.m },
  barberCard: {
    width: 100, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden', ...Shadow.cardSm,
  },
  barberImg: { width: '100%', height: 100 },
  barberInfo: { padding: 10, alignItems: 'center' },
  barberName: { ...Typography.titleS, fontSize: 12, color: Colors.textPrimary, marginBottom: 2 },
  barberRatingText: { ...Typography.bodyS, fontSize: 10, color: Colors.textSecondary },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingTop: 16, paddingHorizontal: Spacing.xl,
    ...Shadow.card,
  },
  footerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { ...Typography.bodyS, color: Colors.textSecondary, marginBottom: 2 },
  bookBtn: {
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  bookBtnText: { ...Typography.titleS, color: '#fff' },
});
