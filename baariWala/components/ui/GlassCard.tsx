import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Glass, Radius, Shadow } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'light' | 'dark' | 'card';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, variant = 'card' }) => {
  const glassStyle = Glass[variant];

  return (
    <View style={[
      styles.container, 
      glassStyle, 
      style,
      // @ts-ignore
      Platform.OS === 'web' && { backdropFilter: glassStyle.backdropFilter }
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.card,
  }
});
