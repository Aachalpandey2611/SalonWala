import React, { useEffect } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors, Radius } from '../../constants/theme';

/**
 * ==========================================
 * COMPONENT: Skeleton
 * ==========================================
 * Purpose: Loading placeholder with a pulsing animation.
 * 
 * Props:
 * - width (number | string): Width of the skeleton block
 * - height (number | string): Height of the skeleton block
 * - variant (string): 'rectangular' | 'circular' | 'rounded'
 */

interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  variant = 'rounded',
  style,
  ...props
}) => {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getBorderRadius = () => {
    switch (variant) {
      case 'circular': return typeof height === 'number' ? height / 2 : 999;
      case 'rectangular': return 0;
      case 'rounded': return Radius.m;
      default: return Radius.m;
    }
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: getBorderRadius(),
        },
        animatedStyle,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
});
