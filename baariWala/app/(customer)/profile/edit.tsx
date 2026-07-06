import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [name, setName] = useState('Aman Sharma');
  const [phone, setPhone] = useState('98765 43210');
  const [email, setEmail] = useState('aman@example.com');

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.m) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
                <View style={styles.editBadge}>
                  <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </Svg>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneInputWrap}>
                <View style={styles.countryCode}><Text style={styles.countryText}>+91</Text></View>
                <TextInput style={[styles.input, { flex: 1 }]} value={phone} onChangeText={setPhone} keyboardType="number-pad" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
          </Animated.View>

        </ScrollView>
        
        <Animated.View entering={SlideInDown.duration(400).delay(200)} style={[styles.footer, { paddingBottom: Math.max(insets.bottom + Spacing.m, Spacing.xl) }]}>
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={() => router.back()}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
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

  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.textPrimary,
    alignItems: 'center', justifyContent: 'center', position: 'relative'
  },
  avatarText: { ...Typography.displayL, color: '#fff', fontSize: 40 },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.textPrimary,
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.background,
  },

  inputGroup: { marginBottom: Spacing.l },
  label: { ...Typography.label, color: Colors.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 16, ...Typography.bodyM, color: Colors.textPrimary,
  },
  phoneInputWrap: { flexDirection: 'row', gap: 10 },
  countryCode: {
    backgroundColor: '#F6F6F6', borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 16, justifyContent: 'center'
  },
  countryText: { ...Typography.bodyM, color: Colors.textPrimary, fontWeight: '600' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: Spacing.xl, paddingTop: Spacing.m,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.textPrimary, paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { ...Typography.titleS, color: '#fff' },
});
