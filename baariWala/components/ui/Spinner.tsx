import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/theme';

/**
 * ==========================================
 * COMPONENT: Spinner
 * ==========================================
 * Purpose: Standardized circular loading indicator.
 * 
 * Props:
 * - color (string): Color of the spinner
 * - size ('small' | 'large'): Size preset
 */

interface SpinnerProps extends ActivityIndicatorProps {
  color?: string;
  size?: 'small' | 'large';
  centered?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  color = Colors.primary,
  size = 'small',
  centered = false,
  ...props
}) => {
  if (centered) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={color} size={size} {...props} />
      </View>
    );
  }
  
  return <ActivityIndicator color={color} size={size} {...props} />;
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
