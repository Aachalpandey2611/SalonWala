import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewProps } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadow, Typography } from '../../constants/theme';
import { Shop } from '../../data/shops';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

/**
 * ==========================================
 * COMPONENT: ShopCard
 * ==========================================
 * Purpose: Display a shop summary snippet in lists.
 */

interface ShopCardProps extends ViewProps {
  shop: Shop;
  onPress?: (shop: Shop) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onPress, style, ...props }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={() => onPress && onPress(shop)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
        {...props}
      >
        <Image 
          source={{ uri: shop.imageUrl }} 
          style={styles.image} 
          contentFit="cover"
          transition={200}
        />

        <View style={styles.details}>
          <Text style={[Typography.titleS, { color: Colors.textPrimary }]} numberOfLines={1}>
            {shop.name}
          </Text>

          <View style={styles.row}>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color={Colors.warning} />
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4, fontWeight: '600' }]}>
                {shop.rating} ({shop.reviewCount})
              </Text>
            </View>
            <View style={styles.distanceBox}>
              <Ionicons name="location-outline" size={14} color={Colors.textTertiary} />
              <Text style={[Typography.caption, { color: Colors.textTertiary, marginLeft: 2 }]}>
                {shop.distance}
              </Text>
            </View>
          </View>

          {/* ETA Badge Below */}
          <View style={styles.etaBadge}>
            <Ionicons name="time-outline" size={14} color={Colors.success} />
            <Text style={[Typography.caption, { color: Colors.success, marginLeft: 4, fontWeight: '600' }]}>
              {shop.waitMins} min wait
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    ...Shadow.card,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: Radius.m,
    backgroundColor: Colors.background,
  },
  details: {
    flex: 1,
    marginLeft: Spacing.m,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successSoft,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginTop: Spacing.s,
  }
});
