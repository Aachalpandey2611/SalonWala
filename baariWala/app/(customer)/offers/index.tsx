import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';

const OFFERS = [
  { id: 'o1', title: 'Weekend Special', subtitle: 'Get 20% off on all hair spa services.', code: 'WEEKEND20' },
  { id: 'o2', title: 'First Booking', subtitle: 'Flat ₹100 off your very first haircut.', code: 'WELCOME100' },
  { id: 'o3', title: 'Beard Trim Combo', subtitle: 'Save ₹50 when you book a haircut and beard trim.', code: 'COMBO50' }
];

export default function OffersScreen() {
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
        <Text style={styles.title}>Offers & Promos</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {OFFERS.map((offer, index) => (
          <Animated.View key={offer.id} entering={FadeInDown.duration(500).delay(index * 100)}>
            <View style={styles.couponCard}>
              <View style={styles.couponLeft}>
                <View style={styles.couponIcon}>
                  <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M20.6 12.3 12.3 20.6a2 2 0 0 1-2.8 0L2.5 13.6a2 2 0 0 1 0-2.8L10.8 2.5a2 2 0 0 1 1.4-.6H18a2.6 2.6 0 0 1 2.6 2.6v6a2 2 0 0 1-.6 1.4Z" />
                    <Circle cx="16" cy="8" r="1.4" fill={Colors.textPrimary} />
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.couponTitle}>{offer.title}</Text>
                  <Text style={styles.couponSub}>{offer.subtitle}</Text>
                </View>
              </View>
              
              <View style={styles.dashedLine} />
              
              <View style={styles.couponRight}>
                <Text style={styles.codeText}>{offer.code}</Text>
                <TouchableOpacity style={styles.copyBtn} activeOpacity={0.7} onPress={() => {}}>
                  <Text style={styles.copyBtnText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...Typography.titleL, color: Colors.textPrimary },
  scroll: { padding: Spacing.xl, paddingBottom: 100 },

  couponCard: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: Spacing.l,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.cardSm,
  },
  couponLeft: {
    flexDirection: 'row', padding: 20, gap: 16, alignItems: 'center',
  },
  couponIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#F6F6F6',
    alignItems: 'center', justifyContent: 'center',
  },
  couponTitle: { ...Typography.titleM, color: Colors.textPrimary, marginBottom: 4 },
  couponSub: { ...Typography.bodyM, color: Colors.textSecondary },
  
  dashedLine: {
    height: 1, borderTopWidth: 1, borderTopColor: Colors.border, borderStyle: 'dashed',
    marginHorizontal: 20,
  },
  
  couponRight: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, paddingHorizontal: 20, backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
  },
  codeText: { ...Typography.titleM, color: Colors.textPrimary, letterSpacing: 2 },
  copyBtn: {
    backgroundColor: Colors.textPrimary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  copyBtnText: { ...Typography.bodyS, color: '#fff', fontWeight: '600' },
});
