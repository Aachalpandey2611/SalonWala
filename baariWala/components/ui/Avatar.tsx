import React from 'react';
import { View, StyleSheet, Text, ViewProps } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Radius, Typography } from '../../constants/theme';

/**
 * ==========================================
 * COMPONENT: Avatar
 * ==========================================
 * Purpose: Display user profile images or initials.
 * 
 * Props:
 * - src (string): URL for the image
 * - initials (string): Fallback text if no image
 * - size (number): Dimension of the avatar (default 48)
 * 
 * Accessibility:
 * - accessibilityRole="image"
 */

interface AvatarProps extends ViewProps {
  src?: string;
  initials?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  initials, 
  size = 48, 
  style, 
  ...props 
}) => {
  const containerStyle = [
    styles.container,
    { width: size, height: size, borderRadius: size / 2 },
    style,
  ];

  if (src) {
    return (
      <Image
        source={src}
        style={containerStyle}
        contentFit="cover"
        accessibilityRole="image"
        {...props}
      />
    );
  }

  return (
    <View style={containerStyle} accessibilityRole="image" {...props}>
      <Text style={[Typography.bodyM, { color: Colors.textInverse, fontWeight: '600' }]}>
        {initials?.substring(0, 2).toUpperCase() || '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
