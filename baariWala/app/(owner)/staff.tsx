import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Header } from '../../components/ui/Header';
import { Avatar } from '../../components/ui/Avatar';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const TEAM = [
  { id: '1', name: 'Rahul Verma', role: 'Senior Barber', access: 'Admin', status: 'Online', serving: 'Amit K.', queue: 4, revenue: '₹4,200' },
  { id: '2', name: 'Sandeep Yadav', role: 'Barber', access: 'Standard', status: 'Busy', serving: 'Rohit S.', queue: 6, revenue: '₹5,100' },
  { id: '3', name: 'Vijay Patil', role: 'Barber', access: 'Standard', status: 'Break', serving: null, queue: 2, revenue: '₹2,800' },
  { id: '4', name: 'Karan Singh', role: 'Junior Barber', access: 'Standard', status: 'Offline', serving: null, queue: 0, revenue: '₹0' },
  { id: '5', name: 'Neha Sharma', role: 'Receptionist', access: 'Admin', status: 'Online', serving: null, queue: 0, revenue: '₹0' },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Online: { color: Colors.success, bg: Colors.successSoft, icon: 'radio-button-on' },
  Busy: { color: Colors.warning, bg: Colors.warningSoft, icon: 'time-outline' },
  Break: { color: Colors.info, bg: Colors.infoSoft, icon: 'cafe-outline' },
  Offline: { color: Colors.textSecondary, bg: Colors.background, icon: 'power-outline' },
};

const TeamCard = ({ item, index }: { item: typeof TEAM[0]; index: number }) => {
  const cfg = STATUS_CONFIG[item.status];
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 60)} style={[styles.card, aStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
      >
        <View style={styles.cardTop}>
          <Avatar size={48} initials={item.name.charAt(0)} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardRole}>{item.role} • {item.access}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon as any} size={10} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{item.status}</Text>
          </View>
        </View>

        {/* Live Status (Only show if they are barbers taking queue) */}
        {item.role.includes('Barber') && (
          <View style={styles.liveBox}>
            <View style={styles.liveMetric}>
              <Text style={styles.metricLabel}>Serving</Text>
              <Text style={styles.metricVal}>{item.serving || 'None'}</Text>
            </View>
            <View style={styles.liveMetric}>
              <Text style={styles.metricLabel}>Queue</Text>
              <Text style={[styles.metricVal, { color: Colors.warning }]}>{item.queue}</Text>
            </View>
            <View style={styles.liveMetric}>
              <Text style={styles.metricLabel}>Revenue</Text>
              <Text style={[styles.metricVal, { color: Colors.primary }]}>{item.revenue}</Text>
            </View>
          </View>
        )}

        {/* Management Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="settings-outline" size={16} color={Colors.primary} />
            <Text style={[styles.actionText, { color: Colors.primary }]}>Manage</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function UnifiedStaffScreen() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? TEAM : TEAM.filter(t => t.status === filter);

  return (
    <View style={styles.screen}>
      <Header
        title="Team Directory"
        showBack
        rightElement={
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="person-add" size={18} color={Colors.surface} />
          </TouchableOpacity>
        }
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterStrip}>
        {['All', 'Online', 'Busy', 'Break', 'Offline'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => <TeamCard item={item} index={index} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  addBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  
  filterStrip: { paddingHorizontal: Spacing.l, paddingVertical: Spacing.m, gap: Spacing.s },
  filterChip: { paddingHorizontal: Spacing.m, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: Colors.surface },

  list: { paddingHorizontal: Spacing.l, paddingBottom: 120 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, marginBottom: Spacing.m, ...Shadow.card, overflow: 'hidden' },
  
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: Spacing.m, gap: Spacing.m },
  cardInfo: { flex: 1 },
  cardName: { ...Typography.titleS, color: Colors.textPrimary, fontWeight: '700' },
  cardRole: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: 10, fontWeight: '700' },

  liveBox: { flexDirection: 'row', backgroundColor: Colors.background, marginHorizontal: Spacing.m, borderRadius: Radius.m, padding: Spacing.m, marginBottom: Spacing.m },
  liveMetric: { flex: 1 },
  metricLabel: { ...Typography.caption, color: Colors.textSecondary, fontSize: 10, textTransform: 'uppercase' },
  metricVal: { ...Typography.titleS, color: Colors.textPrimary, fontWeight: '700', marginTop: 2 },

  actionsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.borderSubtle },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.m, gap: Spacing.s },
  actionText: { ...Typography.label, color: Colors.textSecondary },
  divider: { width: 1, backgroundColor: Colors.borderSubtle, marginVertical: Spacing.s },
});
