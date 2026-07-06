import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface QuickActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon, title, description, color, onPress
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, styles.wrapper]}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.93); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
        style={styles.card}
      >
        <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={26} color={color} />
        </View>
        <Text style={[Typography.titleS, { color: Colors.textPrimary, marginTop: Spacing.m }]}>
          {title}
        </Text>
        <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 2 }]}>
          {description}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '48%',
    marginBottom: Spacing.m,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    padding: Spacing.l,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    minHeight: 110,
    justifyContent: 'flex-start',
    ...Shadow.card,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

