import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import Animated, { FadeInDown, Layout, SlideInDown } from 'react-native-reanimated';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const FAQ_DATA = [
  { q: "How does the live queue work?", a: "Once you book, you receive a dynamic token number. We calculate real-time wait estimates based on the shop's speed, allowing you to arrive just in time." },
  { q: "Can I cancel my booking?", a: "Yes, you can cancel your booking from the Bookings tab. Note that frequent last-minute cancellations may temporarily restrict your booking privileges." },
  { q: "How are payments handled?", a: "You can pay directly at the shop using cash or UPI. We will soon launch SalonWala Wallet for seamless in-app payments." },
];

export default function SupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.m) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInDown.duration(400)}>
          
          <View style={styles.contactCard}>
            <View style={styles.contactIcon}>
              <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </Svg>
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactTitle}>Need more help?</Text>
              <Text style={styles.contactSub}>Our support team is available 24/7</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.chatBtn} activeOpacity={0.8}>
            <Text style={styles.chatBtnText}>Chat with us</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqGroup}>
            {FAQ_DATA.map((faq, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.faqRow}
                  onPress={() => toggleFaq(index)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.faqQ, expandedFaq === index && { color: Colors.textPrimary }]}>{faq.q}</Text>
                  <View style={[styles.chevron, expandedFaq === index && styles.chevronExpanded]}>
                    <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={Colors.textPrimary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M6 9l6 6 6-6" />
                    </Svg>
                  </View>
                </TouchableOpacity>
                {expandedFaq === index && (
                  <Animated.View layout={Layout} entering={SlideInDown} style={styles.faqBody}>
                    <Text style={styles.faqA}>{faq.a}</Text>
                  </Animated.View>
                )}
                {index < FAQ_DATA.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
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

  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.m,
    marginBottom: Spacing.l,
  },
  contactIcon: { 
    width: 60, height: 60, borderRadius: 16, backgroundColor: '#fff', 
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border, ...Shadow.cardSm
  },
  contactText: { flex: 1 },
  contactTitle: { ...Typography.titleL, color: Colors.textPrimary },
  contactSub: { ...Typography.bodyM, color: Colors.textSecondary },
  
  chatBtn: { 
    backgroundColor: Colors.textPrimary, paddingVertical: 16, borderRadius: 12, 
    alignItems: 'center', marginBottom: Spacing.xl 
  },
  chatBtnText: { ...Typography.titleS, color: '#fff' },

  sectionTitle: { ...Typography.titleM, color: Colors.textPrimary, marginBottom: Spacing.m },
  
  faqGroup: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.cardSm,
  },
  faqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  faqQ: { ...Typography.titleS, color: Colors.textSecondary, flex: 1, paddingRight: Spacing.m },
  chevron: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  chevronExpanded: { transform: [{ rotate: '180deg' }] },
  
  faqBody: { paddingBottom: Spacing.m },
  faqA: { ...Typography.bodyM, color: Colors.textSecondary, lineHeight: 22 },
  
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
});
