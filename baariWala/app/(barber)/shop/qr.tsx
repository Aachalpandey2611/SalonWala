import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function QRCodeScreen() {
  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Shop QR Code" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View entering={FadeInUp.duration(500)} style={styles.qrContainer}>
          <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.s }]}>
            Style Zone Salon
          </Text>
          <Text style={[Typography.bodyM, { color: Colors.textSecondary, marginBottom: Spacing.xl, textAlign: 'center' }]}>
            Customers can scan this code to view your shop and join the live queue instantly.
          </Text>

          <View style={styles.qrCard}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={140} color={Colors.textPrimary} />
            </View>
            <Text style={[Typography.titleS, { color: Colors.textPrimary, marginTop: Spacing.l }]}>
              SCAN TO JOIN QUEUE
            </Text>
            <Text style={[Typography.caption, { color: Colors.textTertiary, marginTop: Spacing.xs }]}>
              SalonWala.com/s/stylezone
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: Colors.primary + '18' }]}>
              <Ionicons name="download-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={[Typography.bodyM, { color: Colors.textPrimary, marginTop: Spacing.s, fontWeight: '600' }]}>
              Download
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: Colors.successSoft }]}>
              <Ionicons name="share-social-outline" size={24} color={Colors.success} />
            </View>
            <Text style={[Typography.bodyM, { color: Colors.textPrimary, marginTop: Spacing.s, fontWeight: '600' }]}>
              Share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: Colors.accentSoft }]}>
              <Ionicons name="print-outline" size={24} color={Colors.accent} />
            </View>
            <Text style={[Typography.bodyM, { color: Colors.textPrimary, marginTop: Spacing.s, fontWeight: '600' }]}>
              Print
            </Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxxxxl,
  },
  qrContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.l,
  },
  qrCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xxxxxl,
    borderRadius: Radius.xl,
    alignItems: 'center',
    ...Shadow.card,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  qrPlaceholder: {
    padding: Spacing.m,
    backgroundColor: Colors.background,
    borderRadius: Radius.l,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.l,
  },
  actionCard: {
    alignItems: 'center',
    marginHorizontal: Spacing.m,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
