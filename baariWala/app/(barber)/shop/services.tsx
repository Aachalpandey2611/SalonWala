import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useServices, ServiceItem } from '../../../hooks/useServices';

export default function ServicesManagementScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { services, isLoading } = useServices();

  const renderItem = useCallback(({ item, index }: { item: ServiceItem; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
      <View style={[styles.serviceCard, !item.active && styles.serviceCardInactive]}>
        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <Text style={[Typography.caption, { color: Colors.primary, fontWeight: '600' }]}>{item.category}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="copy-outline" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="pencil-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[Typography.titleM, { color: item.active ? Colors.textPrimary : Colors.textTertiary }]}>
          {item.name}
        </Text>
        
        <View style={styles.detailsRow}>
          <Text style={[Typography.bodyM, { color: Colors.textSecondary }]}>{item.duration}</Text>
          <Text style={[Typography.titleS, { color: Colors.textPrimary }]}>{item.price}</Text>
        </View>

        {!item.active && (
          <View style={styles.inactiveBanner}>
            <Text style={[Typography.caption, { color: Colors.error }]}>Currently Disabled</Text>
          </View>
        )}
      </View>
    </Animated.View>
  ), []);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cut-outline" size={48} color={Colors.textTertiary} />
      <Text style={[Typography.titleM, { color: Colors.textSecondary, marginTop: Spacing.m }]}>No Services Found</Text>
      <Text style={[Typography.bodyM, { color: Colors.textTertiary, textAlign: 'center', marginTop: Spacing.xs }]}>
        Try adjusting your search or add a new service to get started.
      </Text>
    </View>
  ), []);

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header 
        title="Services" 
        showBack 
        rightElement={
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="add-circle" size={28} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchContainer}>
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search services..."
          leftIcon={<Ionicons name="search" size={20} color={Colors.textTertiary} />}
          containerStyle={{ marginBottom: 0 }}
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options" size={20} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    padding: Spacing.l,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    backgroundColor: Colors.surface,
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: Radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.m,
  },
  listContent: {
    padding: Spacing.l,
    paddingBottom: Spacing.xxxxxl,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxxxl,
  },
  serviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    ...Shadow.card,
  },
  serviceCardInactive: {
    opacity: 0.7,
    backgroundColor: Colors.background,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  categoryBadge: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: Radius.s,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  inactiveBanner: {
    marginTop: Spacing.m,
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
});
