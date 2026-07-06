import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../constants/theme';
import Animated, { FadeIn, FadeInDown, SlideInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.9:5000/api/v1';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (step === 'phone') {
      if (phone.length < 10) {
        Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        const data = await res.json();
        if (data.success) {
          setStep('otp');
        } else {
          Alert.alert('Error', data.message || 'Failed to send OTP');
        }
      } catch (err) {
        Alert.alert('Network Error', 'Ensure backend is running at ' + API_URL);
      } finally {
        setLoading(false);
      }
    } else {
      if (otp.length < 4) {
        Alert.alert('Invalid OTP', 'Please enter the 4-digit code.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/otp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, otp })
        });
        const data = await res.json();
        if (data.success) {
          await AsyncStorage.setItem('accessToken', data.data.accessToken);
          router.replace('/(customer)/home');
        } else {
          Alert.alert('Error', data.message || 'Invalid OTP');
        }
      } catch (err) {
        Alert.alert('Network Error', 'Ensure backend is running at ' + API_URL);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 60 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={() => router.replace('/')} style={styles.backBtn}>
                <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M19 12H5M12 19l-7-7 7-7" />
                </Svg>
              </TouchableOpacity>
              <View style={styles.iconWrapper}>
                <Svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8}>
                  <Path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                  <Path d="M12 18h.01" />
                </Svg>
              </View>
            </View>
            <Text style={styles.title}>
              {step === 'phone' ? 'Welcome to SalonWala' : 'Verify your number'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'phone' 
                ? 'Enter your phone number to sign in or create a new account.' 
                : `We've sent a 4-digit code to +91 ${phone}`}
            </Text>
          </Animated.View>

          {/* Dynamic Input Area */}
          {step === 'phone' ? (
            <Animated.View key="phone-step" entering={FadeInDown.duration(600).delay(150)} exiting={FadeOut.duration(300)}>
              <View style={[styles.inputCard, isFocused && styles.inputCardFocused]}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.inputRow}>
                  <View style={styles.countryPill}>
                    <Text style={styles.countryText}>🇮🇳 +91</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="00000 00000"
                    placeholderTextColor={Colors.iconInactive}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoFocus
                  />
                </View>
              </View>
            </Animated.View>
          ) : (
            <Animated.View key="otp-step" entering={FadeInDown.duration(600).delay(150)}>
              <View style={[styles.inputCard, isFocused && styles.inputCardFocused]}>
                <Text style={styles.inputLabel}>4-Digit Code</Text>
                <TextInput
                  style={[styles.input, { textAlign: 'center', fontSize: 24, letterSpacing: 12 }]}
                  placeholder="••••"
                  placeholderTextColor={Colors.iconInactive}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoFocus
                />
              </View>
              <TouchableOpacity onPress={() => setStep('phone')} style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={{ ...Typography.bodyS, color: Colors.textSecondary, textDecorationLine: 'underline' }}>
                  Edit phone number
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </ScrollView>
        
        {/* Sticky Bottom CTA */}
        <Animated.View entering={SlideInDown.duration(500).delay(500)} style={[styles.footer, { paddingBottom: Math.max(insets.bottom + Spacing.m, Spacing.xl) }]}>
          <TouchableOpacity
            style={[styles.ctaButton, (step === 'phone' ? phone.length !== 10 : otp.length !== 4) && styles.ctaDisabled]}
            activeOpacity={0.8}
            onPress={handleContinue}
            disabled={step === 'phone' ? phone.length !== 10 : otp.length !== 4}
          >
            <Text style={styles.ctaText}>{step === 'phone' ? 'Continue' : 'Verify & Login'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 22, paddingBottom: 100 },
  
  header: { marginBottom: 32 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16, backgroundColor: '#F6F6F6',
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  title: { ...Typography.displayL, fontSize: 26, color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { ...Typography.bodyM, color: Colors.textSecondary },

  inputCard: {
    backgroundColor: '#fff', padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadow.cardSm,
  },
  inputCardFocused: { borderColor: Colors.textPrimary },
  inputLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  countryPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F6F6F6', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10,
  },
  countryText: { ...Typography.bodyM, color: Colors.textPrimary, fontWeight: '600' },
  input: {
    flex: 1, backgroundColor: '#F6F6F6', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    ...Typography.bodyM, color: Colors.textPrimary, fontWeight: '600', letterSpacing: 2,
  },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 22, paddingTop: 16,
  },
  ctaButton: {
    backgroundColor: Colors.textPrimary, paddingVertical: 16, borderRadius: 12, alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { ...Typography.titleS, color: '#fff' },
});
