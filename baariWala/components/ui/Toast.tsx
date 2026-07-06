import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  runOnJS 
} from 'react-native-reanimated';
import { Colors, Radius, Spacing, Shadow, Typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

/**
 * ==========================================
 * COMPONENT: Toast
 * ==========================================
 * Purpose: Non-blocking floating feedback message.
 * 
 * Props:
 * - message (string): Toast message
 * - type ('success' | 'error' | 'info'): Severity type
 * - onHide (function): Callback when animation ends
 */

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onHide?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onHide }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });

    const hideDelay = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(-20, { duration: 300 }, (isFinished) => {
        if (isFinished && onHide) {
          runOnJS(onHide)();
        }
      });
    }, 3000);

    return () => clearTimeout(hideDelay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const getTypeStyles = () => {
    switch (type) {
      case 'success': return { bg: Colors.successSoft, color: Colors.success, icon: 'checkmark-circle' as const };
      case 'error': return { bg: Colors.errorSoft, color: Colors.error, icon: 'alert-circle' as const };
      case 'info':
      default:
        return { bg: Colors.infoSoft, color: Colors.info, icon: 'information-circle' as const };
    }
  };

  const { bg, color, icon } = getTypeStyles();

  return (
    <Animated.View style={[styles.container, { backgroundColor: bg }, animatedStyle]}>
      <Ionicons name={icon} size={20} color={color} style={styles.icon} />
      <Text style={[Typography.bodyM, { color: Colors.textPrimary }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderRadius: Radius.full,
    ...Shadow.floating,
    zIndex: 9999,
  },
  icon: {
    marginRight: Spacing.s,
  },
});
