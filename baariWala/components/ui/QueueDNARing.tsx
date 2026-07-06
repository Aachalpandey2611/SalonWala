import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence, withDelay } from 'react-native-reanimated';
import { Colors, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface QueueDNARingProps {
  position: number;
  total: number;
  size?: number;
}

export const QueueDNARing = ({ position, total, size = 120 }: QueueDNARingProps) => {
  const pulse1 = useSharedValue(0.2);
  const pulse2 = useSharedValue(0.1);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    pulse1.value = withRepeat(withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
    pulse2.value = withRepeat(withDelay(750, withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) })), -1, true);
    
    // Slow rotation for the rings
    rotate.value = withRepeat(withTiming(360, { duration: 10000, easing: Easing.linear }), -1, false);
    
    // Subtle breathing scale
    scale.value = withRepeat(withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    opacity: pulse1.value,
    transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: pulse2.value,
    transform: [{ rotate: `-${rotate.value}deg` }, { scale: scale.value * 1.1 }],
  }));

  const getStatusColor = () => {
    if (position === 1) return Colors.success;
    if (position <= 3) return Colors.warning;
    return Colors.primary;
  };

  const statusColor = getStatusColor();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      
      {/* Outer pulsing ring */}
      <Animated.View 
        style={[
          styles.ring, 
          ring2Style, 
          { width: size, height: size, borderRadius: size / 2, borderColor: statusColor, borderWidth: 2, borderStyle: 'dashed' }
        ]} 
      />

      {/* Inner pulsing ring */}
      <Animated.View 
        style={[
          styles.ring, 
          ring1Style, 
          { width: size * 0.85, height: size * 0.85, borderRadius: size * 0.425, borderColor: statusColor, borderWidth: 4 }
        ]} 
      />

      {/* Core Number */}
      <View style={[styles.core, { backgroundColor: Colors.surface, shadowColor: statusColor }]}>
        <Text style={[Typography.displayL, { color: statusColor, fontSize: size * 0.35, lineHeight: size * 0.45 }]}>
          {position}
        </Text>
        <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: -4 }]}>
          of {total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: '65%',
    height: '65%',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
