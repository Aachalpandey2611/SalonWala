import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useThemeStore, GenderPreference } from '../store/themeStore';
import { Colors, Typography, Shadow } from '../constants/theme';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

interface Props {
  visible: boolean;
  onSelect: () => void;
}

export const GenderSelectionModal: React.FC<Props> = ({ visible, onSelect }) => {
  const { setGenderPreference } = useThemeStore();

  const handleSelect = (pref: GenderPreference) => {
    setGenderPreference(pref);
    onSelect();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={FadeInUp} exiting={FadeOutDown} style={styles.modalCard}>
          <Text style={styles.title}>Welcome to SalonWala</Text>
          <Text style={styles.subtitle}>Personalize your experience</Text>

          <TouchableOpacity style={[styles.optionCard, { borderColor: '#2B6CB0' }]} onPress={() => handleSelect('MEN')}>
            <Text style={styles.emoji}>👨</Text>
            <View>
              <Text style={styles.optionTitle}>Men's Grooming</Text>
              <Text style={styles.optionSub}>Haircuts, Beard Styling, Spa</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionCard, { borderColor: '#D53F8C' }]} onPress={() => handleSelect('WOMEN')}>
            <Text style={styles.emoji}>👩</Text>
            <View>
              <Text style={styles.optionTitle}>Women's Beauty</Text>
              <Text style={styles.optionSub}>Bridal, Makeup, Hair Coloring</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionCard, { borderColor: '#B7791F' }]} onPress={() => handleSelect('NEUTRAL')}>
            <Text style={styles.emoji}>🌟</Text>
            <View>
              <Text style={styles.optionTitle}>Explore Both</Text>
              <Text style={styles.optionSub}>Discover everything</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    ...Shadow.card
  },
  title: {
    ...Typography.heading2,
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12
  },
  emoji: {
    fontSize: 32,
    marginRight: 16
  },
  optionTitle: {
    ...Typography.heading4,
    color: Colors.textPrimary
  },
  optionSub: {
    ...Typography.bodyS,
    color: Colors.textSecondary
  }
});
