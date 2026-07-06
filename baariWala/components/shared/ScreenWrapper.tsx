import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

/**
 * ==========================================
 * COMPONENT: ScreenWrapper
 * ==========================================
 * Purpose: Top-level wrapper for every screen ensuring Safe Area, background colors, 
 *          padding consistency, and keyboard avoidance.
 * 
 * Props:
 * - children: Screen content
 * - useSafeArea (boolean): Apply safe area boundaries (default true)
 * - usePadding (boolean): Apply horizontal spacing based on theme (default true)
 * - avoidKeyboard (boolean): Wrap in KeyboardAvoidingView (default true)
 * - backgroundColor (string): Override default background
 */

interface ScreenWrapperProps {
  children: React.ReactNode;
  useSafeArea?: boolean;
  usePadding?: boolean;
  avoidKeyboard?: boolean;
  backgroundColor?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  useSafeArea = true,
  usePadding = true,
  avoidKeyboard = true,
  backgroundColor = Colors.background,
}) => {
  const Container = useSafeArea ? SafeAreaView : View;

  const content = (
    <Container style={[styles.container, { backgroundColor }]}>
      <View style={[styles.inner, usePadding && { paddingHorizontal: Spacing.l }]}>
        {children}
      </View>
    </Container>
  );

  if (avoidKeyboard) {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});
