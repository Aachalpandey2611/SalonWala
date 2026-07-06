import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeInDown } from 'react-native-reanimated';
import { GlassCard } from './GlassCard';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface AIConciergeCardProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'insight' | 'warning' | 'offer';
}

export const AIConciergeCard = ({ message, actionLabel, onAction, type = 'insight' }: AIConciergeCardProps) => {
  const shimmer = useSharedValue(0.3);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const iconConfig = {
    insight: { icon: 'sparkles', color: '#8B5CF6' },
    warning: { icon: 'time', color: Colors.warning },
    offer: { icon: 'pricetag', color: Colors.success },
  };

  const activeConfig = iconConfig[type];

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return (
    <Animated.View entering={FadeInDown.duration(600).delay(200)}>
      <GlassCard intensity={80} style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Animated.View style={[styles.glow, shimmerStyle, { backgroundColor: activeConfig.color }]} />
            <Ionicons name={activeConfig.icon as any} size={20} color={activeConfig.color} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Smart Insight</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
        
        {actionLabel && onAction && (
          <TouchableOpacity style={styles.actionBtn} onPress={onAction}>
            <Text style={[styles.actionText, { color: activeConfig.color }]}>{actionLabel}</Text>
            <Ionicons name="arrow-forward" size={14} color={activeConfig.color} />
          </TouchableOpacity>
        )}
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.m,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.m,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.m,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: Radius.m,
    filter: 'blur(8px)', // Works on web
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  message: {
    ...Typography.bodyS,
    color: Colors.textPrimary,
    fontWeight: '600',
    lineHeight: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginTop: Spacing.s,
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: Spacing.m,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  actionText: {
    ...Typography.caption,
    fontWeight: '700',
  },
});
