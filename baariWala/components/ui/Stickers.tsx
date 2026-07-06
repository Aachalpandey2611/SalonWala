import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

export const ScissorsSticker = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.sticker, { transform: [{ rotate: '14deg' }] }, style]}>
    <Svg viewBox="0 0 64 64" width="54" height="54">
      <Circle cx="32" cy="32" r="30" fill="#F5E9D6" stroke="#2B2118" strokeWidth="1.5" />
      <G transform="translate(13,16)" fill="none" stroke="#2B2118" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="4" cy="4" r="4" fill="#E2572B" stroke="#2B2118" />
        <Circle cx="4" cy="26" r="4" fill="#0F6E56" stroke="#2B2118" />
        <Line x1="7.5" y1="6.5" x2="32" y2="26" />
        <Line x1="7.5" y1="23.5" x2="32" y2="4" />
      </G>
    </Svg>
  </View>
);

export const CombSticker = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.sticker, { transform: [{ rotate: '-18deg' }] }, style]}>
    <Svg viewBox="0 0 80 36" width="64" height="29">
      <Rect x="2" y="2" width="76" height="10" rx="3" fill="#F2A93B" stroke="#2B2118" strokeWidth="1.6" />
      <G stroke="#2B2118" strokeWidth="1.6" strokeLinecap="round">
        {[8,16,24,32,40,48,56,64,72].map(x => (
          <Line key={x} x1={x} y1="12" x2={x} y2="32" />
        ))}
      </G>
    </Svg>
  </View>
);

export const PoleSticker = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.sticker, { transform: [{ rotate: '12deg' }] }, style]}>
    <Svg viewBox="0 0 40 80" width="30" height="60">
      <Rect x="14" y="2" width="12" height="6" rx="2" fill="#2B2118" />
      <Rect x="6" y="8" width="28" height="60" rx="14" fill="#FFFDF8" stroke="#2B2118" strokeWidth="1.6" />
      <Path d="M6 14 L20 8 M6 26 L34 14 M6 38 L34 26 M6 50 L34 38 M6 62 L34 50 M14 68 L34 62" stroke="#E2572B" strokeWidth="5" strokeLinecap="round" fill="none" />
      <Rect x="14" y="70" width="12" height="6" rx="2" fill="#2B2118" />
    </Svg>
  </View>
);

export const RazorSticker = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.sticker, { transform: [{ rotate: '-10deg' }] }, style]}>
    <Svg viewBox="0 0 70 40" width="46" height="26">
      <Rect x="2" y="16" width="40" height="8" rx="2" fill="#0F6E56" stroke="#2B2118" strokeWidth="1.6" />
      <Path d="M42 14 L66 6 L66 34 L42 26 Z" fill="#FFFDF8" stroke="#2B2118" strokeWidth="1.6" strokeLinejoin="round" />
      <Line x1="46" y1="13" x2="62" y2="9" stroke="#2B2118" strokeWidth="1.2" />
      <Line x1="46" y1="20" x2="64" y2="20" stroke="#2B2118" strokeWidth="1.2" />
      <Line x1="46" y1="27" x2="62" y2="31" stroke="#2B2118" strokeWidth="1.2" />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
    shadowColor: '#2B2118',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 6,
  }
});
