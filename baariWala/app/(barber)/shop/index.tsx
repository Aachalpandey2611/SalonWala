import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Divider } from '../../../components/ui/Divider';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface NavRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
}

const NavRow: React.FC<NavRowProps> = ({ icon, label, subtitle, onPress }) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.navRow}>
    <View style={styles.navIconBox}>
      <Ionicons name={icon as any} size={20} color={Colors.primary} />
    </View>
    <View style={styles.navTextBox}>
      <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '500' }]}>{label}</Text>
      {subtitle && <Text style={[Typography.caption, { color: Colors.textTertiary, marginTop: 2 }]}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
  </TouchableOpacity>
);

export default function ShopProfileScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Cover & Header */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <View style={styles.coverContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80' }}
              style={styles.coverImage}
              contentFit="cover"
            />
            {/* Navigation Overlay */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.surface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.qrBtn} onPress={() => router.push('/(barber)/shop/qr')}>
              <Ionicons name="qr-code-outline" size={20} color={Colors.surface} />
            </TouchableOpacity>
          </View>

          {/* Shop Info Card (Overlaps Cover) */}
          <View style={styles.infoCard}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80' }}
                style={styles.logoImage}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
              </View>
            </View>

            <View style={styles.titleRow}>
              <Text style={[Typography.displayM, { color: Colors.textPrimary, flex: 1 }]}>
                Style Zone Salon
              </Text>
              <TouchableOpacity onPress={() => router.push('/(barber)/shop/info')} style={styles.editBtn}>
                <Ionicons name="pencil" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            
            <Text style={[Typography.bodyM, { color: Colors.textSecondary, marginBottom: Spacing.s }]}>
              Premium Barber Shop · Managed by Rahul V.
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaBadge}>
                <Ionicons name="star" size={14} color={Colors.warning} />
                <Text style={[Typography.caption, { color: Colors.textPrimary, marginLeft: 4, fontWeight: '600' }]}>4.9 (124)</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="location" size={14} color={Colors.textSecondary} />
                <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>Andheri West</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Management Sections */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Operations</Text>
          <View style={styles.card}>
            <NavRow icon="cut-outline" label="Services" subtitle="Manage haircuts, trimming, etc." onPress={() => router.push('/(barber)/shop/services')} />
            <Divider />
            <NavRow icon="people-outline" label="Staff" subtitle="Manage barbers and roles" onPress={() => router.push('/(barber)/shop/staff')} />
            <Divider />
            <NavRow icon="time-outline" label="Working Hours" subtitle="Set timings, breaks, holidays" onPress={() => router.push('/(barber)/shop/hours')} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Assets & Settings</Text>
          <View style={styles.card}>
            <NavRow icon="images-outline" label="Gallery" subtitle="Shop photos and branding" onPress={() => router.push('/(barber)/shop/gallery')} />
            <Divider />
            <NavRow icon="settings-outline" label="Shop Settings" subtitle="Preferences, privacy, alerts" onPress={() => router.push('/(barber)/shop/settings')} />
          </View>
        </Animated.View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxxxxl,
  },
  coverContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: Colors.border,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: Spacing.l,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBtn: {
    position: 'absolute',
    top: 50,
    right: Spacing.l,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.l,
    marginTop: -40,
    borderRadius: Radius.xl,
    padding: Spacing.l,
    ...Shadow.card,
    marginBottom: Spacing.m,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: Radius.l,
    backgroundColor: Colors.background,
    marginTop: -40,
    borderWidth: 3,
    borderColor: Colors.surface,
    position: 'relative',
    marginBottom: Spacing.m,
    ...Shadow.card,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: Radius.m,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  editBtn: {
    padding: Spacing.s,
    backgroundColor: Colors.accentSoft,
    borderRadius: Radius.full,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginRight: Spacing.m,
  },
  section: {
    paddingHorizontal: Spacing.l,
    marginTop: Spacing.l,
  },
  sectionLabel: {
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.s,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    overflow: 'hidden',
    ...Shadow.card,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
  },
  navIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.m,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  navTextBox: {
    flex: 1,
  },
});
