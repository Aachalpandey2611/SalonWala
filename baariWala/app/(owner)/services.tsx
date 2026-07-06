import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Header } from '../../components/ui/Header';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SERVICE_CATEGORIES = ['All', 'Hair', 'Beard', 'Skin', 'Special'];

const SERVICES = [
  { id: '1', name: 'Classic Haircut', category: 'Hair', price: '₹300', duration: '30m', active: true, assignedTo: 4, bookings: 124, icon: 'cut-outline', color: Colors.primary },
  { id: '2', name: 'Beard Trim & Shape', category: 'Beard', price: '₹150', duration: '15m', active: true, assignedTo: 4, bookings: 88, icon: 'man-outline', color: Colors.accent },
  { id: '3', name: 'Hair Color (Global)', category: 'Hair', price: '₹800', duration: '60m', active: true, assignedTo: 2, bookings: 31, icon: 'color-palette-outline', color: '#8B5CF6' },
  { id: '4', name: 'Facial Massage', category: 'Skin', price: '₹500', duration: '45m', active: false, assignedTo: 1, bookings: 15, icon: 'sparkles-outline', color: '#EC4899' },
  { id: '5', name: 'Head Massage', category: 'Special', price: '₹250', duration: '20m', active: true, assignedTo: 3, bookings: 47, icon: 'happy-outline', color: Colors.success },
];

export default function ServiceAssignmentScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState(SERVICES);

  const toggleService = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const filtered = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

  return (
    <View style={styles.screen}>
      <Header
        title="Service Configuration"
        showBack
        rightElement={
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={20} color={Colors.surface} />
          </TouchableOpacity>
        }
      />

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryBar}>
        {SERVICE_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.catLabel, activeCategory === cat && styles.catLabelActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Summary */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{services.filter(s => s.active).length}</Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{services.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{services.reduce((a, s) => a + s.bookings, 0)}</Text>
          <Text style={styles.summaryLabel}>Bookings</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.map((srv, index) => (
          <Animated.View key={srv.id} entering={FadeInDown.duration(400).delay(index * 60)}>
            <View style={[styles.serviceCard, !srv.active && styles.inactiveCard]}>
              {/* Top Row */}
              <View style={styles.cardTop}>
                <View style={[styles.serviceIcon, { backgroundColor: srv.color + '18' }]}>
                  <Ionicons name={srv.icon as any} size={22} color={srv.color} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{srv.name}</Text>
                  <View style={styles.serviceMetaRow}>
                    <View style={styles.metaBadge}>
                      <Ionicons name="time-outline" size={11} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>{srv.duration}</Text>
                    </View>
                    <View style={styles.metaBadge}>
                      <Ionicons name="cash-outline" size={11} color={Colors.success} />
                      <Text style={[styles.metaText, { color: Colors.success, fontWeight: '700' }]}>{srv.price}</Text>
                    </View>
                    <View style={styles.metaBadge}>
                      <Ionicons name="bookmark-outline" size={11} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>{srv.bookings} bookings</Text>
                    </View>
                  </View>
                </View>
                <Switch
                  value={srv.active}
                  onValueChange={() => toggleService(srv.id)}
                  trackColor={{ false: Colors.borderSubtle, true: Colors.success }}
                  thumbColor={Colors.surface}
                  style={{ transform: [{ scale: 0.85 }] }}
                />
              </View>

              {/* Staff Assignment */}
              <View style={styles.assignRow}>
                <Ionicons name="people-outline" size={15} color={Colors.textSecondary} />
                <Text style={styles.assignText}>
                  Assigned to <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>{srv.assignedTo}</Text> staff
                </Text>
                <TouchableOpacity style={styles.manageBtn}>
                  <Text style={styles.manageBtnText}>Manage</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  addBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  categoryBar: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    gap: Spacing.s,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  catChip: {
    paddingHorizontal: Spacing.l, paddingVertical: 8,
    borderRadius: Radius.full, backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catLabel: { ...Typography.bodyS, color: Colors.textSecondary, fontWeight: '600' },
  catLabelActive: { color: Colors.surface },

  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.l,
    marginVertical: Spacing.l,
    borderRadius: Radius.xl,
    ...Shadow.card,
  },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.l },
  summaryDivider: { width: 1, backgroundColor: Colors.borderSubtle, marginVertical: Spacing.m },
  summaryValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  summaryLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },

  list: { paddingHorizontal: Spacing.l, paddingBottom: 120 },

  serviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.m,
    overflow: 'hidden',
    ...Shadow.card,
  },
  inactiveCard: { opacity: 0.6 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
    gap: Spacing.m,
  },
  serviceIcon: {
    width: 48, height: 48, borderRadius: Radius.l,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceName: { ...Typography.titleS, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  serviceMetaRow: { flexDirection: 'row', gap: Spacing.s, flexWrap: 'wrap' },
  metaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.background, paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.full,
  },
  metaText: { ...Typography.caption, color: Colors.textSecondary },

  assignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  assignText: { ...Typography.caption, color: Colors.textSecondary, flex: 1 },
  manageBtn: {
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: Spacing.m,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  manageBtnText: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
});
