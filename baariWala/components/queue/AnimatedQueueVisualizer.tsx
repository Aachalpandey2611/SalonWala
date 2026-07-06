import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence, withDelay } from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface AnimatedQueueVisualizerProps {
  servingToken: string;
  nextTokens: string[];
}

export const AnimatedQueueVisualizer: React.FC<AnimatedQueueVisualizerProps> = ({ servingToken, nextTokens }) => {
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.in(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const servingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
    shadowOpacity: withTiming(pulseAnim.value === 1.2 ? 0.3 : 0.1, { duration: 200 }),
  }));

  return (
    <View style={styles.container}>
      {/* Current Serving Ring */}
      <View style={styles.servingWrapper}>
        <Animated.View style={[styles.pulseRing, servingStyle]} />
        <View style={styles.servingCircle}>
          <Text style={[Typography.caption, { color: Colors.surface, opacity: 0.8 }]}>Serving</Text>
          <Text style={[Typography.titleL, { color: Colors.surface, fontWeight: '800' }]}>#{servingToken}</Text>
        </View>
      </View>

      {/* Connecting Flow Line */}
      <View style={styles.flowLine}>
        <Animated.View style={styles.flowDot} />
        <Animated.View style={[styles.flowDot, { opacity: 0.6 }]} />
        <Animated.View style={[styles.flowDot, { opacity: 0.3 }]} />
      </View>

      {/* Next Up Tokens */}
      <View style={styles.nextWrapper}>
        {nextTokens.slice(0, 3).map((token, index) => (
          <View key={token} style={[styles.nextToken, { marginLeft: index === 0 ? 0 : -12, zIndex: 10 - index }]}>
            <Text style={[Typography.label, { color: Colors.primary }]}>#{token}</Text>
          </View>
        ))}
        {nextTokens.length > 3 && (
          <View style={[styles.nextToken, { marginLeft: -12, zIndex: 1, backgroundColor: Colors.borderSubtle }]}>
            <Text style={[Typography.label, { color: Colors.textSecondary }]}>+{nextTokens.length - 3}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  servingWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
  },
  pulseRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accentSoft,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 4,
  },
  servingCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  flowLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: Spacing.s,
  },
  flowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  nextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextToken: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }
});
