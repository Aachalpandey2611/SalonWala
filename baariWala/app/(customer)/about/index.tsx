import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AboutScreen() {
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
        <Text style={styles.title}>About Us</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInDown.duration(400)} style={styles.contentCard}>
          <View style={styles.logoSection}>
            <View style={styles.logoMark}>
              <Text style={styles.logoText}>BW</Text>
            </View>
            <Text style={styles.appName}>SalonWala</Text>
            <Text style={styles.version}>Version 1.0.0 (Flagship Build)</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.paragraph}>
            SalonWala was created to eliminate the friction of waiting in salons. Time is your most valuable asset, and our goal is to give it back to you.
          </Text>
          <Text style={styles.paragraph}>
            With live queue tracking, seamless booking, and direct access to top-rated professionals, we are building the future of personal grooming.
          </Text>
          <Text style={[styles.paragraph, { fontWeight: '600', color: Colors.textPrimary, marginTop: Spacing.m }]}>
            Built with dedication in India.
          </Text>
          
          <View style={styles.divider} />
          
          <View style={styles.links}>
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Rate us on the App Store</Text>
              <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={Colors.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M9 18l6-6-6-6" />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Follow us on Instagram</Text>
              <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={Colors.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M9 18l6-6-6-6" />
              </Svg>
            </TouchableOpacity>
          </View>
        </Animated.View>

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

  contentCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 24,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.cardSm,
  },
  
  logoSection: { alignItems: 'center', marginBottom: Spacing.l },
  logoMark: {
    width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.textPrimary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    ...Shadow.cardSm
  },
  logoText: { ...Typography.displayM, color: '#fff' },
  appName: { ...Typography.displayM, color: Colors.textPrimary, marginBottom: 4 },
  version: { ...Typography.bodyS, color: Colors.textSecondary },
  
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 24 },
  
  paragraph: { ...Typography.bodyM, color: Colors.textSecondary, lineHeight: 24, marginBottom: 16 },
  
  links: { gap: 16 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkText: { ...Typography.titleS, color: Colors.textPrimary },
});
