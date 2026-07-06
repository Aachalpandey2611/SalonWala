import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

/**
 * ==========================================
 * COMPONENT: SegmentedControl
 * ==========================================
 * Purpose: Switch between contextual views (e.g., Today vs Upcoming).
 */

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onChange,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${100 / options.length}%`,
      transform: [{ translateX: withTiming(selectedIndex * 100 + '%', { duration: 250 }) }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.activeBackground, animatedStyle, { left: 0 }]} />
      {options.map((option, index) => {
        const isActive = selectedIndex === index;
        return (
          <TouchableOpacity
            key={option}
            style={styles.segment}
            activeOpacity={1}
            onPress={() => onChange(index)}
          >
            <Text
              style={[
                Typography.bodyS,
                { 
                  color: isActive ? Colors.textInverse : Colors.textSecondary,
                  fontWeight: isActive ? '600' : '400' 
                }
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.borderSubtle,
    borderRadius: Radius.m,
    padding: 2,
    height: 40,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    backgroundColor: Colors.primary,
    borderRadius: Radius.s,
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  }
});
