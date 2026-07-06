import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { ShopCard } from '../../components/shop/ShopCard';
import { AmbientBackground } from '../../components/ui/AmbientBackground';
import { Colors, Spacing, Typography, Radius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { DUMMY_SHOPS } from '../../data/shops';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';

const ANIMATED_PLACEHOLDERS = [
  'Search barbershop near you...',
  'Find a beard trim specialist...',
  'Discover top-rated stylists...',
  'Book a haircut nearby...',
];

const FILTERS = ['Open Now', 'Price', 'Distance', 'Rating'];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate animated placeholder text
  useEffect(() => {
    if (query.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex(i => (i + 1) % ANIMATED_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [query]);

  // Simulate active search state
  const isSearching = query.length > 0;
  const filteredShops = DUMMY_SHOPS.filter(shop => 
    shop.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleBack = () => {
    Keyboard.dismiss();
    router.back();
  };

  return (
    <ScreenWrapper backgroundColor="transparent" usePadding={false}>
      <AmbientBackground />
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.searchWrapper}>
          <Input 
            placeholder={ANIMATED_PLACEHOLDERS[placeholderIndex]} 
            autoFocus
            value={query}
            onChangeText={setQuery}
            leftIcon={<Ionicons name="search" size={20} color={Colors.textTertiary} />}
            rightIcon={
              query ? (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <Ionicons name="close-circle" size={20} color={Colors.textTertiary} />
                </TouchableOpacity>
              ) : undefined
            }
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Pre-Search State */}
        {!isSearching && (
          <Animated.View entering={FadeIn.duration(400)}>
            
            {/* Filter Row */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipContainer}
            >
              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
              {FILTERS.map((filter) => (
                <Chip 
                  key={filter} 
                  label={filter} 
                  style={styles.chip}
                />
              ))}
            </ScrollView>

            {/* Recent Searches */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[Typography.titleS, { color: Colors.textPrimary }]}>Recent Searches</Text>
                <Text style={[Typography.label, { color: Colors.accent }]}>Clear</Text>
              </View>
              
              <TouchableOpacity style={styles.recentRow}>
                <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
                <Text style={[Typography.bodyM, styles.recentText]}>Style Zone Salon</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.recentRow}>
                <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
                <Text style={[Typography.bodyM, styles.recentText]}>Haircut near me</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        )}

        {/* Post-Search State / Results */}
        {isSearching && (
          <Animated.View entering={SlideInRight.duration(300)} style={styles.resultsSection}>
            <Text style={[Typography.bodyM, { color: Colors.textSecondary, marginBottom: Spacing.m }]}>
              {filteredShops.length} results found
            </Text>

            {filteredShops.length > 0 ? (
              filteredShops.map(shop => (
                <Animated.View key={shop.id} entering={FadeInDown.duration(400)}>
                  <ShopCard 
                    shop={shop} 
                    onPress={() => console.log('Navigate to Detail')} 
                  />
                </Animated.View>
              ))
            ) : (
              // Empty State
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color={Colors.border} />
                <Text style={[Typography.titleM, { color: Colors.textPrimary, marginTop: Spacing.m }]}>
                  No results found
                </Text>
                <Text style={[Typography.bodyM, { color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.s }]}>
                  We couldn't find any shops matching "{query}". Try a different keyword.
                </Text>
              </View>
            )}
          </Animated.View>
        )}

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    zIndex: 10,
  },
  backBtn: {
    marginRight: Spacing.m,
    paddingBottom: Spacing.xl, // align with input visually
  },
  searchWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxxxl,
  },
  chipContainer: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  filterBtn: {
    height: 32,
    width: 32,
    borderRadius: Radius.s,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  chip: {
    marginRight: Spacing.m,
  },
  section: {
    paddingHorizontal: Spacing.l,
    marginTop: Spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  recentText: {
    marginLeft: Spacing.m,
    color: Colors.textPrimary,
  },
  resultsSection: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxxxxl,
    paddingHorizontal: Spacing.xl,
  }
});
