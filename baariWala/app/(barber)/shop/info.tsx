import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Colors, Radius, Spacing, Typography } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ShopInfoScreen() {
  const router = useRouter();

  // Mock State
  const [name, setName] = useState('Style Zone Salon');
  const [desc, setDesc] = useState('Premium Barber Shop offering classic cuts, fades, and expert beard grooming in a modern environment.');
  const [address, setAddress] = useState('Shop 4, Crystal Plaza, Andheri West');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('contact@stylezone.com');

  const handleSave = () => {
    // Save logic
    router.back();
  };

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Shop Information" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.formSection}>
          <Text style={[Typography.label, styles.sectionLabel]}>Basic Details</Text>

          <Text style={styles.fieldLabel}>Shop Name</Text>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Enter shop name"
            leftIcon={<Ionicons name="storefront-outline" size={20} color={Colors.textTertiary} />}
          />

          <Text style={styles.fieldLabel}>Description</Text>
          <Input
            value={desc}
            onChangeText={setDesc}
            placeholder="Brief description about your shop"
            multiline
            numberOfLines={3}
            containerStyle={{ height: 100, alignItems: 'flex-start' }}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.formSection}>
          <Text style={[Typography.label, styles.sectionLabel]}>Contact Information</Text>

          <Text style={styles.fieldLabel}>Phone Number</Text>
          <Input
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={20} color={Colors.textTertiary} />}
          />

          <Text style={styles.fieldLabel}>Email Address</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textTertiary} />}
          />

          <Text style={styles.fieldLabel}>Full Address</Text>
          <Input
            value={address}
            onChangeText={setAddress}
            placeholder="Complete address"
            multiline
            leftIcon={<Ionicons name="location-outline" size={20} color={Colors.textTertiary} />}
          />
          <View style={styles.mapLocatorBtn}>
            <Ionicons name="navigate-circle-outline" size={18} color={Colors.primary} />
            <Text style={[Typography.label, { color: Colors.primary, marginLeft: 6 }]}>
              Locate on Map
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.formSection}>
          <Text style={[Typography.label, styles.sectionLabel]}>Capacity Configuration</Text>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: Spacing.s, flex: 1 }]}>
              Configure how many chairs/barbers operate concurrently. This impacts queue wait-time estimations.
            </Text>
          </View>

          <Text style={styles.fieldLabel}>Active Chairs</Text>
          <Input
            value="4"
            keyboardType="number-pad"
            leftIcon={<Ionicons name="people-outline" size={20} color={Colors.textTertiary} />}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.actions}>
          <Button label="Save Changes" onPress={handleSave} style={{ marginBottom: Spacing.m }} />
          <Button label="Discard" variant="secondary" onPress={() => router.back()} />
        </Animated.View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxxxxl,
    paddingTop: Spacing.l,
  },
  formSection: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.l,
  },
  sectionLabel: {
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.m,
  },
  fieldLabel: {
    ...Typography.bodyS,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  mapLocatorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: -Spacing.xs,
    marginBottom: Spacing.m,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8EAF6',
    padding: Spacing.m,
    borderRadius: Radius.m,
    marginBottom: Spacing.m,
  },
  actions: {
    paddingHorizontal: Spacing.l,
    marginTop: Spacing.l,
  },
});
