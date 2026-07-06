import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function PrivacyScreen() {
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
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInDown.duration(400)} style={styles.contentCard}>
          <View style={styles.iconHeader}>
            <View style={styles.iconBox}>
              <Svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke={Colors.textPrimary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </Svg>
            </View>
            <Text style={styles.docTitle}>Data & Privacy</Text>
            <Text style={styles.docSub}>Last updated: June 2026</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            At SalonWala, your privacy is our priority. We collect only necessary information such as your phone number, name, and location (when permitted) to facilitate your bookings and estimate your wait times.
          </Text>
          
          <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
          <Text style={styles.paragraph}>
            Your data is used strictly to power the core functionality of the app. We do not sell or share your personal data with third-party advertisers. Your phone number acts as your primary identifier for logging in.
          </Text>
          
          <Text style={styles.sectionTitle}>3. Security</Text>
          <Text style={styles.paragraph}>
            Your data is securely encrypted both in transit and at rest. We employ industry-standard security measures to prevent unauthorized access to your account details.
          </Text>
          
          <Text style={styles.sectionTitle}>4. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to request the deletion of your account and associated data at any time by contacting our support team.
          </Text>
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
  
  iconHeader: { alignItems: 'center', marginBottom: Spacing.l },
  iconBox: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#F6F6F6',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  docTitle: { ...Typography.titleL, color: Colors.textPrimary, marginBottom: 4 },
  docSub: { ...Typography.bodyS, color: Colors.textSecondary },
  
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 24 },
  
  sectionTitle: { ...Typography.titleM, color: Colors.textPrimary, marginBottom: 8 },
  paragraph: { ...Typography.bodyM, color: Colors.textSecondary, lineHeight: 24, marginBottom: 24 },
});
