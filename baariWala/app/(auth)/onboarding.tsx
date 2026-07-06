import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated as RNAnimated, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, interpolateColor } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AmbientBackground } from '../../components/ui/AmbientBackground';

const { width, height } = Dimensions.get('window');

const LANGUAGES = [
  { id: 'en', label: 'English', sub: 'Welcome', icon: 'earth-outline' },
  { id: 'hi', label: 'Hindi', sub: 'नमस्ते', icon: 'language-outline' },
  { id: 'mr', label: 'Marathi', sub: 'नमस्कार', icon: 'chatbubble-outline' },
];

const CITIES = [
  { id: '1', name: 'Indore, MP' },
  { id: '2', name: 'Bhopal, MP' },
  { id: '3', name: 'Mumbai, MH' },
  { id: '4', name: 'Pune, MH' },
];

const GENDERS = [
  { id: 'male', label: 'Male', icon: 'male-outline' },
  { id: 'female', label: 'Female', icon: 'female-outline' },
  { id: 'other', label: 'Other', icon: 'male-female-outline' },
];

const TOTAL_STEPS = 3;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);

  // State
  const [lang, setLang] = useState('en');
  const [city, setCity] = useState('1');
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('male');

  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      scrollRef.current?.scrollTo({ x: nextStep * width, animated: true });
    } else {
      router.replace('/(customer)/home');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      scrollRef.current?.scrollTo({ x: prevStep * width, animated: true });
    } else {
      router.back();
    }
  };

  const StepIndicator = () => {
    return (
      <View style={styles.indicatorRow}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.dot, step === i && styles.dotActive, step > i && styles.dotCompleted]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <View style={[styles.header, { paddingTop: insets.top + Spacing.m }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <StepIndicator />
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* STEP 0: LANGUAGE */}
        <View style={styles.page}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.titleArea}>
            <Text style={styles.title}>Choose Language</Text>
            <Text style={styles.subtitle}>Pick your preferred language</Text>
          </Animated.View>

          <View style={styles.list}>
            {LANGUAGES.map((l, i) => (
              <Animated.View key={l.id} entering={FadeInUp.duration(400).delay(i * 100)}>
                <TouchableOpacity
                  style={[styles.card, lang === l.id && styles.cardActive]}
                  onPress={() => setLang(l.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconBox, lang === l.id && { backgroundColor: Colors.primarySoft }]}>
                    <Ionicons name={l.icon as any} size={24} color={lang === l.id ? Colors.primary : Colors.textSecondary} />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={[styles.cardLabel, lang === l.id && { color: Colors.primary }]}>{l.label}</Text>
                    <Text style={styles.cardSub}>{l.sub}</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color={lang === l.id ? Colors.primary : 'transparent'} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* STEP 1: LOCATION */}
        <View style={styles.page}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.titleArea}>
            <Text style={styles.title}>Where are you?</Text>
            <Text style={styles.subtitle}>Find barbershops near you</Text>
          </Animated.View>

          <View style={styles.list}>
            <Animated.View entering={FadeInUp.duration(400).delay(100)}>
              <Input
                placeholder="Search your city..."
                value={search}
                onChangeText={setSearch}
                leftIcon={<Ionicons name="search" size={20} color={Colors.textTertiary} />}
                style={{ marginBottom: Spacing.l }}
              />
            </Animated.View>

            <TouchableOpacity style={styles.currentLocBtn}>
              <Ionicons name="locate" size={20} color={Colors.surface} />
              <Text style={styles.currentLocText}>Use current location</Text>
            </TouchableOpacity>

            <Text style={styles.popularLabel}>Popular Cities</Text>
            {CITIES.map((c, i) => (
              <Animated.View key={c.id} entering={FadeInUp.duration(400).delay(200 + i * 50)}>
                <TouchableOpacity
                  style={[styles.locCard, city === c.id && styles.cardActive]}
                  onPress={() => setCity(c.id)}
                >
                  <Ionicons name="location-outline" size={20} color={city === c.id ? Colors.primary : Colors.textSecondary} />
                  <Text style={[styles.locLabel, city === c.id && { color: Colors.primary, fontWeight: '700' }]}>{c.name}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* STEP 2: GENDER */}
        <View style={styles.page}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.titleArea}>
            <Text style={styles.title}>Select Gender</Text>
            <Text style={styles.subtitle}>To personalize salon recommendations</Text>
          </Animated.View>

          <View style={styles.list}>
            {GENDERS.map((g, i) => (
              <Animated.View key={g.id} entering={FadeInUp.duration(400).delay(i * 100)}>
                <TouchableOpacity
                  style={[styles.card, gender === g.id && styles.cardActive]}
                  onPress={() => setGender(g.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconBox, gender === g.id && { backgroundColor: Colors.primarySoft }]}>
                    <Ionicons name={g.icon as any} size={24} color={gender === g.id ? Colors.primary : Colors.textSecondary} />
                  </View>
                  <Text style={[styles.cardLabel, { flex: 1 }, gender === g.id && { color: Colors.primary }]}>{g.label}</Text>
                  <Ionicons name="checkmark-circle" size={24} color={gender === g.id ? Colors.primary : 'transparent'} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FIXED FOOTER */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.l) }]}>
        <Button label={step === TOTAL_STEPS - 1 ? 'Finish' : 'Continue'} onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.l, paddingBottom: Spacing.m,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    ...Shadow.card,
  },
  indicatorRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  dotCompleted: { backgroundColor: Colors.primarySoft },

  page: { width, paddingHorizontal: Spacing.xl },
  titleArea: { marginTop: Spacing.xl, marginBottom: Spacing.xxxxl },
  title: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5, marginBottom: Spacing.s },
  subtitle: { ...Typography.bodyM, color: Colors.textSecondary },

  list: { gap: Spacing.m },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, padding: Spacing.m,
    borderRadius: Radius.l, borderWidth: 2, borderColor: 'transparent',
    ...Shadow.card, gap: Spacing.m,
  },
  cardActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft + '40' },
  iconBox: {
    width: 48, height: 48, borderRadius: Radius.m,
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardLabel: { ...Typography.titleS, color: Colors.textPrimary, fontWeight: '700' },
  cardSub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },

  currentLocBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.m,
    backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: Radius.l,
    marginBottom: Spacing.xl, ...Shadow.floating,
  },
  currentLocText: { ...Typography.titleS, color: Colors.surface, fontWeight: '700' },
  popularLabel: { ...Typography.label, color: Colors.textTertiary, textTransform: 'uppercase', marginBottom: Spacing.xs },
  locCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.m,
    paddingVertical: 14, paddingHorizontal: Spacing.l,
    backgroundColor: Colors.surface, borderRadius: Radius.l,
    borderWidth: 2, borderColor: 'transparent',
  },
  locLabel: { ...Typography.bodyM, color: Colors.textPrimary, flex: 1 },

  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.m,
    backgroundColor: 'transparent',
  },
});
