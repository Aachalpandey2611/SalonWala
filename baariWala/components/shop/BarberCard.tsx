import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { Barber } from '../../data/barbers';

interface BarberCardProps {
  barber: Barber;
  isSelected?: boolean;
  onPress?: (barber: Barber) => void;
}

export const BarberCard: React.FC<BarberCardProps> = ({ barber, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress && onPress(barber)}
      style={[styles.card, isSelected && styles.cardSelected, !barber.available && styles.cardDisabled]}
      disabled={!barber.available}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: barber.imageUrl }} style={styles.image} contentFit="cover" />
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
          </View>
        )}
      </View>
      
      <Text style={[Typography.label, styles.name]} numberOfLines={1}>
        {barber.name}
      </Text>
      
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={12} color={Colors.warning} />
        <Text style={[Typography.caption, { marginLeft: 2, color: Colors.textSecondary }]}>
          {barber.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginRight: Spacing.m,
    width: 80,
  },
  cardSelected: {
    // Style applied via badge and opacity if needed
  },
  cardDisabled: {
    opacity: 0.5,
  },
  imageContainer: {
    width: 64,
    height: 64,
    marginBottom: Spacing.xs,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
  },
  name: {
    color: Colors.textPrimary,
    marginBottom: 2,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
