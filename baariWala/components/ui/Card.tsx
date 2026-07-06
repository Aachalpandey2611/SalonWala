import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '../../constants/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  noPadding = false, 
  style, 
  ...props 
}) => {
  return (
    <View
      style={[
        styles.card,
        !noPadding && { padding: Spacing.l },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    ...Shadow.card,
  },
});
