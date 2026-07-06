import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { Service } from '../../data/services';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  onPress?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onPress }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress && onPress(service)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, isSelected && styles.cardSelected]}
      >
        <View style={styles.left}>
          <Text style={[Typography.titleS, { color: Colors.textPrimary, marginBottom: 4 }]}>
            {service.name}
          </Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            {service.duration} mins • {service.description}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.s }]}>
            ₹{service.price}
          </Text>
          <View style={[styles.radio, isSelected && styles.radioSelected]}>
            {isSelected && <Ionicons name="checkmark" size={14} color={Colors.surface} />}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: Radius.l,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: Spacing.m,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSoft,
  },
  left: {
    flex: 1,
    marginRight: Spacing.m,
  },
  right: {
    alignItems: 'flex-end',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  radioSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    borderWidth: 0,
  }
});
