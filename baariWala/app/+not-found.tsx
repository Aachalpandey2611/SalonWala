import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Radius, Shadow } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="compass-outline" size={48} color={Colors.accent} />
        </View>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>
          The screen you're looking for doesn't exist or has been moved.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/')}>
          <Ionicons name="home-outline" size={18} color={Colors.surface} />
          <Text style={styles.primaryBtnText}>Go Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryBtnText}>Go Back</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.accentSoft,
    opacity: 0.5,
  },
  blob2: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.primarySoft,
    opacity: 0.5,
  },
  content: {
    alignItems: 'center',
    marginBottom: Spacing.xxxxxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.card,
  },
  code: {
    fontSize: 72,
    fontWeight: '900',
    color: Colors.border,
    letterSpacing: -4,
    marginBottom: Spacing.m,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    width: '100%',
    gap: Spacing.m,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Radius.l,
    ...Shadow.floating,
  },
  primaryBtnText: {
    ...Typography.titleS,
    color: Colors.surface,
    fontWeight: '700',
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Radius.l,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  secondaryBtnText: {
    ...Typography.titleS,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
