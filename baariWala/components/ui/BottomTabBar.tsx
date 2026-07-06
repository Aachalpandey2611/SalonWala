import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const NavIcons = {
  home: ({ isFocused, color }: { isFocused: boolean; color: string }) => (
    <Svg viewBox="0 0 24 24" width={22} height={22} fill={isFocused ? color : 'none'} stroke={!isFocused ? color : 'none'} strokeWidth={1.8}>
      {isFocused ? (
        <Path d="M12 3 2 12h3v8h6v-5h2v5h6v-8h3L12 3Z" fill={color} stroke="none" />
      ) : (
        <Path d="M12 3 2 12h3v8h6v-5h2v5h6v-8h3L12 3Z" stroke={color} fill="none" />
      )}
    </Svg>
  ),
  'queue/my-queue': ({ color }: { color: string }) => (
    <Svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={color} strokeWidth={1.8}>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 2" />
    </Svg>
  ),
  bookings: ({ color }: { color: string }) => (
    <Svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={color} strokeWidth={1.8}>
      <Rect x="4" y="5" width="16" height="16" rx="2.5" />
      <Path d="M4 10h16M8 3v4M16 3v4" />
    </Svg>
  ),
  profile: ({ color }: { color: string }) => (
    <Svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={color} strokeWidth={1.8}>
      <Circle cx="12" cy="8" r="3.5" />
      <Path d="M5 20c1.5-4 4-6 7-6s5.5 2 7 6" />
    </Svg>
  )
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  // The definitive 4 tabs allowed in the bottom bar
  const ALLOWED_TABS = ['home', 'queue/my-queue', 'bookings', 'profile'];

  return (
    <View style={[styles.navbar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {ALLOWED_TABS.map((tabName) => {
        const routeIndex = state.routes.findIndex(r => r.name === tabName);
        if (routeIndex === -1) return null; // Route doesn't exist in navigator yet
        
        const route = state.routes[routeIndex];
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === routeIndex;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const IconComponent = NavIcons[route.name as keyof typeof NavIcons];
        const color = isFocused ? Colors.primary : Colors.iconInactive;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            {IconComponent && <IconComponent isFocused={isFocused} color={color} />}
            <Text style={[styles.label, { color }]}>{label as string}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    flex: 1,
  },
  label: {
    ...Typography.bodyS,
    fontSize: 10,
    fontWeight: '500',
  }
});
