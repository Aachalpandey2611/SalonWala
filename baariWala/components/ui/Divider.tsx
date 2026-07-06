import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../../constants/theme';

/**
 * ==========================================
 * COMPONENT: Divider
 * ==========================================
 * Purpose: Visual separator between content blocks.
 * 
 * Props:
 * - orientation: 'horizontal' | 'vertical'
 * - thickness: number (default 1)
 * - color: string (default Colors.borderSubtle)
 */

interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color = Colors.borderSubtle,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        orientation === 'horizontal'
          ? { width: '100%', height: thickness }
          : { height: '100%', width: thickness },
        { backgroundColor: color },
        style,
      ]}
      {...props}
    />
  );
};
