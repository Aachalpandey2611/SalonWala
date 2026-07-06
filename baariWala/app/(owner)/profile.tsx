import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Avatar } from '../../components/ui/Avatar';
import { Divider } from '../../components/ui/Divider';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function OwnerProfileScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Owner Profile" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Animated.View entering={FadeInUp.duration(500)} style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Avatar size={96} initials="RP" />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color={Colors.surface} />
            </TouchableOpacity>
          </View>
          <Text style={[Typography.titleM, { color: Colors.textPrimary, marginTop: Spacing.m }]}>Ramesh Patel</Text>
          <Text style={[Typography.bodyM, { color: Colors.textSecondary, marginTop: 4 }]}>Owner, Style Zone Salon</Text>
          
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
            <Text style={[Typography.caption, { color: Colors.success, marginLeft: 4, fontWeight: '600' }]}>Verified Business</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Contact Details</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={Colors.textTertiary} />
              <Text style={[Typography.bodyM, { color: Colors.textPrimary, marginLeft: Spacing.m, flex: 1 }]}>+91 98765 43210</Text>
              <Text style={[Typography.caption, { color: Colors.primary }]}>Edit</Text>
            </View>
            <Divider />
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={Colors.textTertiary} />
              <Text style={[Typography.bodyM, { color: Colors.textPrimary, marginLeft: Spacing.m, flex: 1 }]}>ramesh.owner@stylezone.com</Text>
              <Text style={[Typography.caption, { color: Colors.primary }]}>Edit</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Account Actions</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.actionRow}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
              <Text style={[Typography.bodyM, { color: Colors.textPrimary, marginLeft: Spacing.m }]}>Change Password</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity style={styles.actionRow} onPress={() => router.replace('/(auth)')}>
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              <Text style={[Typography.bodyM, { color: Colors.error, marginLeft: Spacing.m }]}>Log Out</Text>
            </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    marginBottom: Spacing.l,
  },
  avatarWrapper: {
    position: 'relative',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successSoft,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginTop: Spacing.m,
  },
  section: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.l,
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
    ...Shadow.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
  },
});
