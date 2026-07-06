import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadow, Radius } from '../../constants/theme';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { useThemeStore } from '../../store/themeStore';
import { GenderSelectionModal } from '../../components/GenderSelectionModal';
import { SkeletonCard, SkeletonText } from '../../components/Skeleton';

const Flap = ({ delay, isSecond }: { delay: number, isSecond?: boolean }) => {
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useFocusEffect(
    React.useCallback(() => {
      rotation.value = 0;
      opacity.value = 1;
      rotation.value = withDelay(delay, withTiming(-180, { duration: 650, easing: Easing.bezier(0.45, 0, 0.2, 1) }));
      opacity.value = withDelay(delay, withTiming(0, { duration: 650, easing: Easing.bezier(0.45, 0, 0.2, 1) }));
    }, [delay])
  );

  const style = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { translateY: -(54 / 2) },
      { rotateX: `${rotation.value}deg` },
      { translateY: (54 / 2) },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.flap, isSecond && { backgroundColor: '#1c1c1c' }, style]} />
  );
};

export default function CustomerHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { genderPreference, getColors } = useThemeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const themeColors = getColors();
  
  const baseOpacity = useSharedValue(0);
  const baseTranslateY = useSharedValue(3);

  useFocusEffect(
    React.useCallback(() => {
      if (!genderPreference) {
        setModalVisible(true);
      }
      // Simulate API load
      setTimeout(() => setLoading(false), 2000);

      baseOpacity.value = 0;
      baseTranslateY.value = 3;
      baseOpacity.value = withDelay(850, withTiming(1, { duration: 450, easing: Easing.out(Easing.ease) }));
      baseTranslateY.value = withDelay(850, withTiming(0, { duration: 450, easing: Easing.out(Easing.ease) }));
    }, [genderPreference])
  );

  const baseStyle = useAnimatedStyle(() => ({
    opacity: baseOpacity.value,
    transform: [{ translateY: baseTranslateY.value }]
  }));

  return (
    <View style={styles.screen}>
      <GenderSelectionModal visible={modalVisible} onSelect={() => setModalVisible(false)} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.m }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>Hi, Priya 👋</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ ...Typography.bodyM, color: themeColors.primary, fontWeight: '600' }}>
                {genderPreference === 'MEN' ? '👨 Men\'s Grooming' : genderPreference === 'WOMEN' ? '👩 Women\'s Beauty' : '🌟 Explore All'} ▾
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bellWrap}>
            <TouchableOpacity style={styles.bell} onPress={() => router.push('/notifications')}>
              <Svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={19} height={19}>
                <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <Path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </Svg>
            </TouchableOpacity>
            <View style={[styles.dot, { backgroundColor: themeColors.accent }]} />
          </View>
        </View>

        {loading ? (
          <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <>
            {/* Serve Stage (Split Flap) */}
            <View style={styles.serveStage}>
              <Animated.View style={[styles.serveBase, baseStyle]}>
                <Text style={styles.serveL}>Now serving · Style Zone Salon</Text>
                <View style={styles.serveR}>
                  <Text style={styles.serveNum}>#07</Text>
                  <Text style={styles.serveWait}>~12 min</Text>
                </View>
              </Animated.View>
              <Flap delay={50} />
              <Flap delay={350} isSecond />
            </View>

            {/* Dynamic Services */}
            <View style={styles.services}>
              {(genderPreference === 'MEN' || genderPreference === 'NEUTRAL') && (
                <TouchableOpacity style={styles.svcCard} activeOpacity={0.8} onPress={() => router.push('/shop/1')}>
                  <View style={styles.svcIll}>
                    <Svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="#111" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <Circle cx="24" cy="16" r="8" />
                      <Path d="M9 40c0-9 6.7-15 15-15s15 6 15 15" />
                      <Path d="M30 10 L40 6 M31 14 L41 12" />
                    </Svg>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.svcTitle}>Men's Grooming</Text>
                    <Text style={styles.svcSub}>Haircut • Beard • Shave • Hair Spa</Text>
                    <Text style={styles.svcPrice}>Starting ₹99</Text>
                  </View>
                  <View style={styles.svcArrow}>
                    <Svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
                      <Path d="M9 6l6 6-6 6" />
                    </Svg>
                  </View>
                </TouchableOpacity>
              )}

              {(genderPreference === 'WOMEN' || genderPreference === 'NEUTRAL') && (
                <TouchableOpacity style={[styles.svcCard, styles.svcCardWomen]} activeOpacity={0.8} onPress={() => router.push('/shop/list')}>
                  <View style={[styles.svcIll, styles.svcIllWomen]}>
                    <Svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="#111" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M24 9c-7 0-11 5-11 12 0 3 1 6 2 9 1 3 3 6 4 9h10c1-3 3-6 4-9 1-3 2-6 2-9 0-7-4-12-11-12Z" />
                      <Path d="M16 24c0-6 3-10 8-10s8 4 8 10" />
                    </Svg>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.svcTitle}>Women's Beauty</Text>
                    <Text style={styles.svcSub}>Hair • Makeup • Facial • Waxing • Spa</Text>
                    <Text style={styles.svcPrice}>Starting ₹199</Text>
                  </View>
                  <View style={styles.svcArrow}>
                    <Svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
                      <Path d="M9 6l6 6-6 6" />
                    </Svg>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {/* Quick Actions */}
        <Text style={styles.qaTitle}>Quick Actions</Text>
        <View style={styles.qaGrid}>
          <TouchableOpacity style={styles.qaBtn} onPress={() => router.push('/shop/list')}>
            <View style={styles.qaIcon}>
              <Svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
                <Path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" />
                <Circle cx="12" cy="10" r="3" />
              </Svg>
            </View>
            <Text style={styles.qaLabel}>Nearby Shops</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaBtn} onPress={() => router.push('/shop/list')}>
            <View style={styles.qaIcon}>
              <Svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
                <Path d="M12 2l3 6 6.5.9-4.7 4.6 1.1 6.5L12 16.9 6.1 20l1.1-6.5L2.5 8.9 9 8l3-6Z" />
              </Svg>
            </View>
            <Text style={styles.qaLabel}>Top Rated</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaBtn} onPress={() => router.push('/offers')}>
            <View style={styles.qaIcon}>
              <Svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
                <Path d="M20.6 12.3 12.3 20.6a2 2 0 0 1-2.8 0L2.5 13.6a2 2 0 0 1 0-2.8L10.8 2.5a2 2 0 0 1 1.4-.6H18a2.6 2.6 0 0 1 2.6 2.6v6a2 2 0 0 1-.6 1.4Z" />
                <Circle cx="16" cy="8" r="1.4" fill="#111" />
              </Svg>
            </View>
            <Text style={styles.qaLabel}>Offers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaBtn} onPress={() => router.push('/membership')}>
            <View style={styles.qaIcon}>
              <Svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
                <Rect x="3" y="6" width="18" height="13" rx="2.5" />
                <Path d="M3 10h18" />
                <Circle cx="7.5" cy="14.5" r="0.6" fill="#111" />
              </Svg>
            </View>
            <Text style={styles.qaLabel}>Membership</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended */}
        <View style={styles.recTitleRow}>
          <Text style={styles.recTitle}>Recommended Nearby Shops</Text>
          <TouchableOpacity><Text style={styles.recSeeAll}>See all</Text></TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recScroll} style={{ flexGrow: 0 }}>
          <View style={styles.shopCard}>
            <View style={[styles.shopImg, { backgroundColor: '#333' }]}>
              <View style={styles.openBadge}>
                <View style={styles.openDot} />
                <Text style={styles.openText}>Open Now</Text>
              </View>
            </View>
            <View style={styles.shopBody}>
              <Text style={styles.shopName}>Style Zone Salon</Text>
              <View style={styles.shopMetaRow}>
                <Text style={styles.shopMeta}>⭐ 4.8</Text>
                <Text style={styles.shopMeta}>1.2 km</Text>
              </View>
              <Text style={styles.shopToken}>Token <Text style={{ color: Colors.textPrimary, fontWeight: '700' }}>#07</Text> · Wait <Text style={{ color: Colors.textPrimary, fontWeight: '700' }}>12 min</Text></Text>
              <TouchableOpacity style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.shopCard}>
            <View style={[styles.shopImg, { backgroundColor: '#555' }]}>
              <View style={styles.openBadge}>
                <View style={styles.openDot} />
                <Text style={styles.openText}>Open Now</Text>
              </View>
            </View>
            <View style={styles.shopBody}>
              <Text style={styles.shopName}>The Hair Studio</Text>
              <View style={styles.shopMetaRow}>
                <Text style={styles.shopMeta}>⭐ 4.5</Text>
                <Text style={styles.shopMeta}>1.8 km</Text>
              </View>
              <Text style={styles.shopToken}>Token <Text style={{ color: Colors.textPrimary, fontWeight: '700' }}>#12</Text> · Wait <Text style={{ color: Colors.textPrimary, fontWeight: '700' }}>20 min</Text></Text>
              <TouchableOpacity style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl, paddingTop: 6,
  },
  greet: { ...Typography.displayM, color: Colors.textPrimary },
  sub: { ...Typography.bodyM, color: Colors.textSecondary, marginTop: 4 },
  bellWrap: { position: 'relative' },
  bell: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: '#FAFAFA',
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.secondary, borderWidth: 2, borderColor: '#fff',
  },

  serveStage: {
    marginHorizontal: 22, marginTop: 16, marginBottom: 4, height: 54, position: 'relative'
  },
  serveBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.textPrimary, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  serveL: { ...Typography.bodyM, fontSize: 12.5, fontWeight: '500', color: '#fff', opacity: 0.7 },
  serveR: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  serveNum: { ...Typography.titleL, color: '#fff' },
  serveWait: { ...Typography.bodyS, fontSize: 11.5, color: '#fff', opacity: 0.75 },
  flap: {
    position: 'absolute', left: 0, right: 0, top: 0, height: '100%',
    backgroundColor: Colors.textPrimary, borderRadius: 14,
    backfaceVisibility: 'hidden',
    zIndex: 3,
  },

  services: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 4, gap: 14 },
  svcCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    borderRadius: 16, padding: 16,
    ...Shadow.card,
  },
  svcCardWomen: { backgroundColor: Colors.surfacePink, borderColor: Colors.borderPink },
  svcIll: {
    width: 58, height: 58, borderRadius: 14, backgroundColor: Colors.surfaceGrey,
    alignItems: 'center', justifyContent: 'center',
  },
  svcIllWomen: { backgroundColor: '#FCE8ED' },
  svcTitle: { ...Typography.titleM, color: Colors.textPrimary },
  svcSub: { ...Typography.bodyS, color: Colors.textSecondary, marginTop: 2 },
  svcPrice: { ...Typography.titleS, fontSize: 12.5, color: Colors.textPrimary, marginTop: 6 },
  svcArrow: {
    marginLeft: 'auto', width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.textPrimary,
    alignItems: 'center', justifyContent: 'center',
  },

  qaTitle: { ...Typography.titleM, fontSize: 15, color: Colors.textPrimary, marginHorizontal: 22, marginTop: 22, marginBottom: 12 },
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 22, gap: 12 },
  qaBtn: {
    width: '48%', backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 16, gap: 10,
    ...Shadow.cardSm,
  },
  qaIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.textPrimary, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { ...Typography.titleS, fontSize: 13, color: Colors.textPrimary },

  recTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginHorizontal: 22, marginTop: 24, marginBottom: 12 },
  recTitle: { ...Typography.titleM, fontSize: 15, color: Colors.textPrimary },
  recSeeAll: { ...Typography.bodyS, fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  recScroll: { paddingHorizontal: 22, paddingBottom: 4, gap: 14 },
  
  shopCard: {
    width: 228, backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 16,
    overflow: 'hidden', ...Shadow.card,
  },
  shopImg: { height: 96, position: 'relative' },
  openBadge: {
    position: 'absolute', top: 10, left: 10, backgroundColor: '#fff',
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999,
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  openDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  openText: { ...Typography.titleS, fontSize: 10, color: Colors.textPrimary },
  shopBody: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },
  shopName: { ...Typography.titleS, color: Colors.textPrimary },
  shopMetaRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  shopMeta: { ...Typography.bodyS, fontSize: 11.5, color: Colors.textSecondary },
  shopToken: { ...Typography.bodyS, fontSize: 11.5, color: Colors.textSecondary, marginTop: 8 },
  bookBtn: {
    marginTop: 10, width: '100%', backgroundColor: Colors.textPrimary,
    paddingVertical: 9, borderRadius: 10, alignItems: 'center',
  },
  bookBtnText: { ...Typography.titleS, fontSize: 12.5, color: '#fff' },
});
