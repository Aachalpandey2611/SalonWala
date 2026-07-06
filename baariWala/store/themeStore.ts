import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GenderPreference = 'MEN' | 'WOMEN' | 'NEUTRAL';

export const ThemeColors = {
  MEN: {
    primary: '#1A365D', // Deep Blue
    accent: '#2B6CB0',
    background: '#F7FAFC',
    text: '#2D3748',
    card: '#FFFFFF',
    tagline: 'Premium Men\'s Grooming'
  },
  WOMEN: {
    primary: '#97266D', // Deep Pink
    accent: '#D53F8C',
    background: '#FFF5F7',
    text: '#2D3748',
    card: '#FFFFFF',
    tagline: 'Luxury Women\'s Beauty'
  },
  NEUTRAL: {
    primary: '#744210', // Dark Gold / Brown
    accent: '#B7791F',
    background: '#FFFAF0',
    text: '#2D3748',
    card: '#FFFFFF',
    tagline: 'Explore All Styles'
  }
};

interface ThemeState {
  genderPreference: GenderPreference | null;
  setGenderPreference: (pref: GenderPreference) => void;
  getColors: () => typeof ThemeColors.MEN;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      genderPreference: null,
      
      setGenderPreference: (pref) => set({ genderPreference: pref }),
      
      getColors: () => {
        const pref = get().genderPreference;
        if (pref === 'MEN') return ThemeColors.MEN;
        if (pref === 'WOMEN') return ThemeColors.WOMEN;
        return ThemeColors.NEUTRAL;
      }
    }),
    {
      name: 'salonwala-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
