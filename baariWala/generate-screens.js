const fs = require('fs');
const path = require('path');

const screens = [
  { path: 'app/(customer)/shop/list.tsx', title: 'Shops' },
  { path: 'app/(customer)/offers/index.tsx', title: 'Offers' },
  { path: 'app/(customer)/membership/index.tsx', title: 'Membership' },
  { path: 'app/(customer)/notifications/index.tsx', title: 'Notifications' },
  { path: 'app/(customer)/bookings/[id].tsx', title: 'Booking Details' },
  { path: 'app/(customer)/profile/edit.tsx', title: 'Edit Profile' },
  { path: 'app/(customer)/settings/index.tsx', title: 'Settings' },
  { path: 'app/(customer)/support/index.tsx', title: 'Help & Support' },
  { path: 'app/(customer)/about/index.tsx', title: 'About Us' },
  { path: 'app/(customer)/privacy/index.tsx', title: 'Privacy Policy' },
];

const template = (title) => `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

export default function PlaceholderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.m) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.title}>${title}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.placeholder}>Content coming soon...</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.m,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...Typography.titleL, color: Colors.textPrimary },
  scroll: { padding: Spacing.xl, alignItems: 'center' },
  placeholder: { ...Typography.bodyM, color: Colors.textSecondary, marginTop: 100 },
});
`;

screens.forEach(s => {
  const fullPath = path.join(__dirname, s.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  
  // Adjust import paths if nesting is different
  const nestLevel = s.path.split('/').length - 1;
  const relativePath = '../'.repeat(nestLevel - 1) + 'constants/theme';
  const content = template(s.title).replace('../../../constants/theme', relativePath);
  
  fs.writeFileSync(fullPath, content);
  console.log('Created', s.path);
});
