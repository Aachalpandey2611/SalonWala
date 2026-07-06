import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PLANS = [
  {
    id: 'p1',
    name: 'SalonWala Plus',
    price: '₹299/mo',
    features: ['Skip the queue at standard salons', '5% cashback on every booking', 'Exclusive members-only offers', 'Priority customer support']
  },
  {
    id: 'p2',
    name: 'SalonWala Premium',
    price: '₹799/mo',
    isPopular: true,
    features: ['Zero wait time at ALL partnered salons', 'Free hair spa once a month', '15% cashback on every booking', 'Access to elite stylists']
  }
];

export default function MembershipScreen() {
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
        <Text style={styles.title}>Membership</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Upgrade your grooming experience.</Text>
          <Text style={styles.heroSub}>Choose a plan that fits your style and skip the wait forever.</Text>
        </View>

        {PLANS.map((plan, index) => (
          <Animated.View key={plan.id} entering={FadeInDown.duration(600).delay(index * 150)}>
            <View style={[styles.planCard, plan.isPopular && styles.planCardPopular]}>
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              
              <View style={styles.divider} />
              
              <View style={styles.features}>
                {plan.features.map((feat, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <Polyline points="20 6 9 17 4 12" />
                    </Svg>
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8} onPress={() => router.back()}>
                <Text style={styles.ctaText}>Choose Plan</Text>
              </TouchableOpacity>
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

  hero: { marginBottom: Spacing.xl, alignItems: 'center', paddingHorizontal: Spacing.m },
  heroTitle: { ...Typography.displayM, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.s },
  heroSub: { ...Typography.bodyM, color: Colors.textSecondary, textAlign: 'center' },

  planCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: Spacing.xl,
    borderWidth: 1, borderColor: Colors.border, position: 'relative',
    ...Shadow.card,
  },
  planCardPopular: {
    borderColor: Colors.textPrimary, borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute', top: -12, alignSelf: 'center',
    backgroundColor: Colors.textPrimary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100,
  },
  popularText: { ...Typography.caption, color: '#fff', fontWeight: '700', letterSpacing: 1 },
  
  planName: { ...Typography.titleL, color: Colors.textPrimary, marginBottom: 4 },
  planPrice: { ...Typography.displayL, color: Colors.textPrimary },
  
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 20 },
  
  features: { marginBottom: 24, gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureText: { ...Typography.bodyM, color: Colors.textPrimary, flex: 1 },

  ctaButton: {
    backgroundColor: Colors.textPrimary, paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  ctaText: { ...Typography.titleS, color: '#fff' },
});
