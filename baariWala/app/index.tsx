import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Shadow } from '../constants/theme';
import Animated, { 
  useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing, 
  withSequence, runOnJS
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

const FlapPanel = ({ text, isIcon, delay }: { text: string, isIcon?: boolean, delay: number }) => {
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    rotation.value = withDelay(delay, withTiming(-180, { duration: 600, easing: Easing.bezier(0.45, 0, 0.2, 1) }));
    opacity.value = withDelay(delay, withTiming(0, { duration: 600, easing: Easing.bezier(0.45, 0, 0.2, 1) }));
  }, [delay]);

  const flapStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { translateY: -35 }, // Half of 70 height
      { rotateX: `${rotation.value}deg` },
      { translateY: 35 }
    ],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.panelContainer}>
      {/* Revealed Base */}
      <View style={styles.panelBase}>
        {isIcon ? (
          <Svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke={Colors.textPrimary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="6" cy="6" r="3" />
            <Circle cx="6" cy="18" r="3" />
            <Path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" />
          </Svg>
        ) : (
          <Text style={styles.panelText}>{text}</Text>
        )}
      </View>
      
      {/* Covering Flap */}
      <Animated.View style={[styles.panelFlap, flapStyle]} />
    </View>
  );
};

export default function SplashScreen() {
  const router = useRouter();
  const screenOpacity = useSharedValue(1);
  const containerScale = useSharedValue(0.95);

  const handleNavigate = () => {
    router.replace('/(auth)/login');
  };

  useEffect(() => {
    // 1.6s-2.2s: Wordmark settles (subtle scale in)
    containerScale.value = withDelay(1600, withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }));

    // 2.2s-3.0s: Soft fade/scale transition out
    screenOpacity.value = withDelay(2500, withTiming(0, { duration: 500 }));

    // Navigate reliably using JS setTimeout
    const timer = setTimeout(() => {
      handleNavigate();
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const animatedScreenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleNavigate} style={{ flex: 1 }}>
      <Animated.View style={[styles.screen, animatedScreenStyle]}>
        <Animated.View style={[styles.logoStack, animatedContainerStyle]}>
          <FlapPanel text="Salon" delay={300} />
          <View style={styles.divider} />
          <FlapPanel text="Wala" delay={650} />
          <View style={styles.divider} />
          <FlapPanel text="" isIcon delay={1000} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Strict white bg
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStack: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    // Add subtle shadow so it feels like a real object
    ...Shadow.card,
  },
  panelContainer: {
    height: 70,
    width: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelBase: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  panelText: {
    ...Typography.displayL,
    fontSize: 42,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  panelFlap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.textPrimary, // Black flap
    borderRadius: 8,
    backfaceVisibility: 'hidden',
    zIndex: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  }
});
