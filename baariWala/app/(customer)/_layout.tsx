import React from 'react';
import { Tabs } from 'expo-router';
import { BottomTabBar } from '../../components/ui/BottomTabBar';

export default function CustomerLayout() {
  return (
    <Tabs 
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ title: 'Home' }} 
      />
      <Tabs.Screen 
        name="queue/my-queue" 
        options={{ title: 'Queue' }} 
      />
      <Tabs.Screen 
        name="bookings" 
        options={{ title: 'Bookings' }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profile' }} 
      />
      {/* Hide specific routes from the bottom tab bar */}
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="shop/[id]" options={{ href: null }} />
    </Tabs>
  );
}
