import React, { useEffect } from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolateColor
} from 'react-native-reanimated';

interface SkeletonProps {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: any;
}

/**
 * Universal Skeleton Loading component.
 * Uses Reanimated to create a smooth, premium shimmer effect.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius = 8, style }) => {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      shimmerValue.value,
      [0, 1],
      ['#E0E0E0', '#F5F5F5']
    );

    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, overflow: 'hidden' },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const SkeletonText: React.FC<{ width: DimensionValue; lines?: number; style?: any }> = ({ width, lines = 1, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          width={i === lines - 1 && lines > 1 ? '70%' : width} 
          height={16} 
          borderRadius={4} 
          style={{ marginBottom: i === lines - 1 ? 0 : 8 }} 
        />
      ))}
    </View>
  );
};

export const SkeletonAvatar: React.FC<{ size: number; style?: any }> = ({ size, style }) => {
  return <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />;
};

export const SkeletonCard: React.FC<{ style?: any }> = ({ style }) => {
  return (
    <View style={[styles.card, style]}>
      <SkeletonAvatar size={50} style={{ marginRight: 16 }} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <SkeletonText width="80%" lines={2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  }
});
