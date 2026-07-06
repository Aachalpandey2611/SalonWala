import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';

interface TimeSlotCardProps {
  time: string;
  isAvailable: boolean;
  isSelected?: boolean;
  onPress?: (time: string) => void;
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ time, isAvailable, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!isAvailable}
      onPress={() => onPress && onPress(time)}
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        !isAvailable && styles.cardDisabled
      ]}
    >
      <Text
        style={[
          Typography.bodyM,
          styles.text,
          isSelected && styles.textSelected,
          !isAvailable && styles.textDisabled
        ]}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
    marginBottom: Spacing.m,
    minWidth: 80,
  },
  cardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  cardDisabled: {
    backgroundColor: Colors.background,
    borderColor: Colors.borderSubtle,
  },
  text: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  textSelected: {
    color: Colors.textInverse,
  },
  textDisabled: {
    color: Colors.textTertiary,
  }
});
