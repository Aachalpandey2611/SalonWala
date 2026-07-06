import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate } from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ActionItem {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

interface FloatingCommandCenterProps {
  actions: ActionItem[];
}

export const FloatingCommandCenter = ({ actions }: FloatingCommandCenterProps) => {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  
  // Animation value: 0 = closed, 1 = open
  const expansion = useSharedValue(0);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    expansion.value = withSpring(nextState ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  };

  const mainBtnStyle = useAnimatedStyle(() => {
    const rotate = interpolate(expansion.value, [0, 1], [0, 45]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom + Spacing.m, Spacing.xxl) }]}>
      
      {/* Action Items (Stacking upwards) */}
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => {
          // Calculate reverse index so the first item in array is at the bottom (closest to FAB)
          const reverseIndex = actions.length - 1 - index;
          
          const actionStyle = useAnimatedStyle(() => {
            const translateY = interpolate(expansion.value, [0, 1], [20, -(reverseIndex * 60 + 10)]);
            const scale = interpolate(expansion.value, [0, 1], [0.5, 1]);
            const opacity = interpolate(expansion.value, [0, 0.8, 1], [0, 0.5, 1]);
            return {
              opacity,
              transform: [{ translateY }, { scale }],
              pointerEvents: isOpen ? 'auto' : 'none',
            };
          });

          return (
            <Animated.View key={index} style={[styles.actionWrapper, actionStyle]}>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: action.color }]} 
                onPress={() => {
                  toggleOpen();
                  action.onPress();
                }}
                activeOpacity={0.8}
              >
                <Ionicons name={action.icon as any} size={20} color={Colors.surface} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* Main Toggle FAB */}
      <TouchableOpacity 
        style={styles.mainFab} 
        onPress={toggleOpen}
        activeOpacity={0.85}
      >
        <Animated.View style={[styles.mainFabInner, mainBtnStyle]}>
          <Ionicons name="add" size={32} color={Colors.surface} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: Spacing.xl,
    alignItems: 'flex-end',
    zIndex: 999,
  },
  actionsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  actionWrapper: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
  },
  actionLabel: {
    ...Typography.caption,
    color: Colors.surface,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.m,
    paddingVertical: 4,
    borderRadius: Radius.s,
    overflow: 'hidden',
    fontWeight: '700',
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  mainFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    ...Shadow.floating,
    marginTop: 20, // Give space for the stack
  },
  mainFabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
