import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { BarberStat } from '../../data/barber-stats';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface StatCardProps {
  stat: BarberStat;
  index?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, index = 0 }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(index * 70)} style={[styles.card, animatedStyle]}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={styles.inner}
      >
        <View style={[styles.iconBox, { backgroundColor: stat.colorAccent + '22' }]}>
          <Ionicons name={stat.icon as any} size={22} color={stat.colorAccent} />
        </View>

        <Text style={[Typography.displayM, styles.value]}>{stat.value}</Text>
        <Text style={[Typography.caption, styles.label]}>{stat.label}</Text>

        {stat.trend !== undefined && (
          <View style={[
            styles.trendBadge,
            { backgroundColor: stat.trendUp ? Colors.successSoft : Colors.errorSoft }
          ]}>
            <Ionicons
              name={stat.trendUp ? 'trending-up' : 'trending-down'}
              size={12}
              color={stat.trendUp ? Colors.success : Colors.error}
            />
            <Text style={[
              Typography.caption,
              { color: stat.trendUp ? Colors.success : Colors.error, marginLeft: 2, fontWeight: '600' }
            ]}>
              {stat.trend}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    width: '48%',
    marginBottom: Spacing.m,
    ...Shadow.card,
    overflow: 'hidden',
  },
  inner: {
    padding: Spacing.l,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.m,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  label: {
    color: Colors.textSecondary,
    marginBottom: Spacing.s,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
});
