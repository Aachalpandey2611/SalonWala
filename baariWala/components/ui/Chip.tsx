import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';

/**
 * ==========================================
 * COMPONENT: Chip
 * ==========================================
 * Purpose: Compact elements that represent an input, attribute, or action.
 * 
 * Props:
 * - label (string): Text content
 * - isActive (boolean): Highlighted state
 * - leftIcon (ReactNode): Optional leading icon
 */

interface ChipProps extends TouchableOpacityProps {
  label: string;
  isActive?: boolean;
  leftIcon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  isActive = false,
  leftIcon,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.chip,
        isActive ? styles.chipActive : styles.chipInactive,
        style,
      ]}
      {...props}
    >
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      <Text
        style={[
          Typography.bodyS,
          { color: isActive ? Colors.textInverse : Colors.textPrimary, fontWeight: '500' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    minHeight: 32,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipInactive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  iconContainer: {
    marginRight: Spacing.xs,
  },
});
