import React from 'react';
import { Tabs } from 'expo-router';
import { BottomTabBar } from '../../components/ui/BottomTabBar';

// Note: In a real implementation, you would wrap this layout in a ThemeProvider 
// that swaps Colors.accent to Colors.parlourAccent.

export default function ParlourLayout() {
  return (
    <Tabs 
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ title: 'Dashboard' }} 
      />
      <Tabs.Screen 
        name="live-queue" 
        options={{ title: 'Live Queue' }} 
      />
      <Tabs.Screen 
        name="schedule" 
        options={{ title: 'Schedule' }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profile' }} 
      />
    </Tabs>
  );
}
