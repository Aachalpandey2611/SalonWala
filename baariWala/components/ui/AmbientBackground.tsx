import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';

export const AmbientBackground = () => {
  const { width, height } = useWindowDimensions();

  const blob1X = useSharedValue(0);
  const blob1Y = useSharedValue(0);
  
  const blob2X = useSharedValue(width * 0.5);
  const blob2Y = useSharedValue(height * 0.5);

  useEffect(() => {
    // Gentle floating animation for blob 1 (Accent)
    blob1X.value = withRepeat(
      withSequence(
        withTiming(width * 0.3, { duration: 15000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-width * 0.1, { duration: 18000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 15000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    blob1Y.value = withRepeat(
      withSequence(
        withTiming(height * 0.4, { duration: 16000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-height * 0.2, { duration: 14000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 18000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Gentle floating animation for blob 2 (Primary Light)
    blob2X.value = withRepeat(
      withSequence(
        withTiming(-width * 0.4, { duration: 19000, easing: Easing.inOut(Easing.ease) }),
        withTiming(width * 0.2, { duration: 17000, easing: Easing.inOut(Easing.ease) }),
        withTiming(width * 0.5, { duration: 15000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    blob2Y.value = withRepeat(
      withSequence(
        withTiming(-height * 0.3, { duration: 15000, easing: Easing.inOut(Easing.ease) }),
        withTiming(height * 0.2, { duration: 20000, easing: Easing.inOut(Easing.ease) }),
        withTiming(height * 0.5, { duration: 16000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [width, height]);

  const style1 = useAnimatedStyle(() => ({
    transform: [{ translateX: blob1X.value }, { translateY: blob1Y.value }],
  }));

  const style2 = useAnimatedStyle(() => ({
    transform: [{ translateX: blob2X.value }, { translateY: blob2Y.value }],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.blob, styles.blob1, style1]} />
      <Animated.View style={[styles.blob, styles.blob2, style2]} />
      
      {/* Web-specific Blur Layer (Glass) */}
      {Platform.OS === 'web' && (
        <View style={styles.blurLayer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    overflow: 'hidden',
    zIndex: -1,
  },
  blob: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    opacity: 0.15,
  },
  blob1: {
    top: -100,
    left: -100,
    backgroundColor: Colors.accent,
  },
  blob2: {
    bottom: -200,
    right: -100,
    backgroundColor: Colors.info,
    opacity: 0.1,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
    // @ts-ignore
    backdropFilter: 'blur(100px)',
    backgroundColor: 'rgba(247, 248, 250, 0.4)',
  }
});
