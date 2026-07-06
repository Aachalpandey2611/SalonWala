import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, Shadow } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SHOPS = [
  { id: '1', name: 'Style Zone Salon', category: 'Unisex', wait: '12 min', rating: '4.8', distance: '1.2 km' },
  { id: '2', name: 'Urban Fade Barbershop', category: 'Men', wait: '0 min', rating: '4.9', distance: '2.5 km' },
  { id: '3', name: 'Elite Grooming Lounge', category: 'Women', wait: '45 min', rating: '4.6', distance: '3.1 km' },
  { id: '4', name: 'Scissors & Combs', category: 'Unisex', wait: '5 min', rating: '4.7', distance: '4.0 km' },
];

export default function ShopListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.m) }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M19 12H5M12 19l-7-7 7-7" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.title}>Explore Shops</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <Circle cx="11" cy="11" r="8" />
              <Path d="M21 21l-4.35-4.35" />
            </Svg>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity style={[styles.filterPill, styles.filterPillActive]}>
            <Text style={[styles.filterText, styles.filterTextActive]}>Nearest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Top Rated</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Zero Wait</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Women Only</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {SHOPS.map((shop, index) => (
          <Animated.View key={shop.id} entering={FadeInDown.duration(500).delay(index * 100)}>
            <TouchableOpacity 
              style={styles.shopCard} 
              activeOpacity={0.8}
              onPress={() => router.push(`/shop/${shop.id}`)}
            >
              <View style={styles.shopImagePlaceholder}>
                <Svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="#6B6B6B" strokeWidth="1.5">
                  <Rect x="8" y="8" width="32" height="32" rx="4" />
                  <Path d="M8 32l10-10 12 12 6-6 4 4" />
                  <Circle cx="18" cy="18" r="3" />
                </Svg>
              </View>
              
              <View style={styles.shopInfo}>
                <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
                <Text style={styles.shopMeta}>{shop.category} • {shop.distance}</Text>
                
                <View style={styles.shopStats}>
                  <View style={styles.statPill}>
                    <Svg viewBox="0 0 24 24" width={14} height={14} fill={Colors.textPrimary} stroke="none">
                      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </Svg>
                    <Text style={styles.statText}>{shop.rating}</Text>
                  </View>
                  <View style={[styles.statPill, { backgroundColor: shop.wait === '0 min' ? '#E8F5EE' : '#F6F6F6' }]}>
                    <Text style={[styles.statText, { color: shop.wait === '0 min' ? Colors.success : Colors.textPrimary }]}>Wait: {shop.wait}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.m,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...Typography.titleL, color: Colors.textPrimary },
  
  filterScroll: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.m, gap: 10 },
  filterPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
    backgroundColor: '#F6F6F6', borderWidth: 1, borderColor: 'transparent',
  },
  filterPillActive: { backgroundColor: Colors.textPrimary },
  filterText: { ...Typography.titleS, color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },

  scroll: { padding: Spacing.xl, paddingBottom: 100 },

  shopCard: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: Spacing.m,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.cardSm,
    flexDirection: 'row', padding: 14, gap: 14,
  },
  shopImagePlaceholder: {
    width: 80, height: 80, borderRadius: 12, backgroundColor: '#F6F6F6',
    alignItems: 'center', justifyContent: 'center',
  },
  shopInfo: { flex: 1, justifyContent: 'center' },
  shopName: { ...Typography.titleM, color: Colors.textPrimary, marginBottom: 4 },
  shopMeta: { ...Typography.bodyS, color: Colors.textSecondary, marginBottom: 10 },
  
  shopStats: { flexDirection: 'row', gap: 8 },
  statPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F6F6F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  statText: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600' },
});
