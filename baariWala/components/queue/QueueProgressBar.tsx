import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface QueueProgressBarProps {
  currentToken: number;
  yourToken: number;
  peopleAhead: number;
}

export const QueueProgressBar: React.FC<QueueProgressBarProps> = ({
  currentToken,
  yourToken,
  peopleAhead,
}) => {
  const progress = Math.max(0, Math.min(1, currentToken / yourToken));

  const barStyle = useAnimatedStyle(() => ({
    width: withSpring(`${progress * 100}%`, { damping: 20 }),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
          Now Serving: <Text style={{ fontWeight: '700', color: Colors.primary }}>#{currentToken}</Text>
        </Text>
        <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
          Your Token: <Text style={{ fontWeight: '700', color: Colors.accent }}>#{yourToken}</Text>
        </Text>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>

      <Text style={[Typography.caption, { color: Colors.textTertiary, marginTop: Spacing.xs }]}>
        {peopleAhead === 0 ? 'You are next!' : `${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead of you`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.s,
  },
  track: {
    height: 12,
    backgroundColor: Colors.borderSubtle,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
});
