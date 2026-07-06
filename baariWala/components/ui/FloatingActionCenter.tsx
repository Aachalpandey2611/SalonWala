import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, interpolate, Extrapolation } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../constants/theme';

interface ActionItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

interface FloatingActionCenterProps {
  actions: ActionItem[];
}

export const FloatingActionCenter: React.FC<FloatingActionCenterProps> = ({ actions }) => {
  const isOpen = useSharedValue(0); // 0 = closed, 1 = open

  const toggleOpen = () => {
    isOpen.value = withSpring(isOpen.value === 0 ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  };

  const mainBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(isOpen.value, [0, 1], [0, 45])}deg` }
      ]
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen.value, { duration: 300 }),
      pointerEvents: isOpen.value > 0.5 ? 'auto' : 'none',
    };
  });

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity style={styles.overlayPressable} activeOpacity={1} onPress={toggleOpen} />
      </Animated.View>

      <View style={styles.container} pointerEvents="box-none">
        {/* Render Action Items */}
        {actions.map((action, index) => {
          const itemStyle = useAnimatedStyle(() => {
            const translateY = interpolate(
              isOpen.value,
              [0, 1],
              [0, -70 * (index + 1)], // Stack upwards
              Extrapolation.CLAMP
            );
            const scale = interpolate(isOpen.value, [0, 0.5, 1], [0, 0.5, 1], Extrapolation.CLAMP);
            const opacity = interpolate(isOpen.value, [0, 0.8, 1], [0, 1, 1], Extrapolation.CLAMP);

            return {
              opacity,
              transform: [
                { translateY },
                { scale }
              ]
            };
          });

          return (
            <Animated.View key={index} style={[styles.actionItemWrapper, itemStyle]}>
              <Text style={[Typography.label, styles.actionLabel]}>{action.label}</Text>
              <TouchableOpacity
                style={[styles.actionItem, { backgroundColor: action.color || Colors.surface }]}
                onPress={() => {
                  toggleOpen();
                  action.onPress();
                }}
              >
                <Ionicons name={action.icon} size={20} color={action.color ? Colors.textInverse : Colors.textPrimary} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Main Floating Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={toggleOpen}>
          <Animated.View style={[styles.mainButton, mainBtnStyle]}>
            <Ionicons name="add" size={32} color={Colors.textInverse} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlayDark,
    zIndex: 100,
  },
  overlayPressable: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: Spacing.xxxxxl + Spacing.l,
    right: Spacing.l,
    alignItems: 'flex-end',
    zIndex: 101,
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.glow,
  },
  actionItemWrapper: {
    position: 'absolute',
    right: 6, // center relative to main button
    bottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabel: {
    color: Colors.textInverse,
    marginRight: Spacing.m,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: Radius.s,
    overflow: 'hidden',
  },
  actionItem: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.floating,
  }
});
