import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QueueStatus } from '../../data/bookings';
import { QUEUE_STATUS_CONFIG } from '../../constants/queue.constants';
import { Radius, Spacing, Typography } from '../../constants/theme';
import Animated, { useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

interface StatusBadgeProps {
  status: QueueStatus;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showDot = true }) => {
  const config = QUEUE_STATUS_CONFIG[status];
  
  // Pulsing animation for active statuses
  const isActive = ['waiting', 'approaching', 'called', 'serving'].includes(status);
  
  const dotOpacity = useAnimatedStyle(() => {
    if (!isActive) return { opacity: 1 };
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.3, { duration: 700 }),
          withTiming(1, { duration: 700 })
        ),
        -1,
        true
      ),
    };
  });

  return (
    <View style={[styles.badge, { backgroundColor: config.background }]}>
      {showDot && (
        <Animated.View 
          style={[
            styles.dot, 
            { backgroundColor: config.color },
            dotOpacity
          ]} 
        />
      )}
      <Text style={[Typography.label, { color: config.color, fontWeight: '600' }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  }
});
