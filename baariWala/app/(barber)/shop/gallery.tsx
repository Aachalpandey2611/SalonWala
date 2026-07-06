import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PHOTOS = [
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80',
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80',
];

export default function GalleryScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Shop Gallery" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
          <Text style={[Typography.label, styles.sectionLabel]}>Upload New Photo</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
            <View style={styles.uploadIconCircle}>
              <Ionicons name="cloud-upload-outline" size={32} color={Colors.primary} />
            </View>
            <Text style={[Typography.titleS, { color: Colors.textPrimary, marginTop: Spacing.m }]}>
              Tap to browse
            </Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: Spacing.xs }]}>
              Supports JPG, PNG up to 5MB
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[Typography.label, styles.sectionLabel, { marginBottom: 0 }]}>Uploaded Photos ({PHOTOS.length})</Text>
            <TouchableOpacity>
              <Text style={[Typography.label, { color: Colors.error }]}>Select & Delete</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {PHOTOS.map((uri, index) => (
              <View key={index} style={styles.gridItem}>
                <Image source={{ uri }} style={styles.image} contentFit="cover" />
                <TouchableOpacity style={styles.deleteBtn}>
                  <Ionicons name="trash" size={16} color={Colors.surface} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
  section: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.m,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  uploadBox: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Radius.l,
    padding: Spacing.xxxxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.s,
  },
  gridItem: {
    width: '50%',
    padding: Spacing.s,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: Radius.m,
    ...Shadow.card,
  },
  deleteBtn: {
    position: 'absolute',
    top: Spacing.m,
    right: Spacing.m,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(239,68,68,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
