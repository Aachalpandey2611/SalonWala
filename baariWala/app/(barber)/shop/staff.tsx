import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Avatar } from '../../../components/ui/Avatar';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const STAFF = [
  { id: '1', name: 'Rahul Verma', role: 'Senior Barber', experience: '8 Yrs', rating: '4.9', active: true, assigned: 12 },
  { id: '2', name: 'Amit Kumar', role: 'Barber', experience: '4 Yrs', rating: '4.7', active: true, assigned: 10 },
  { id: '3', name: 'Sandeep Yadav', role: 'Stylist', experience: '6 Yrs', rating: '4.8', active: false, assigned: 8 },
];

export default function StaffManagementScreen() {
  const router = useRouter();

  const renderItem = ({ item, index }: { item: typeof STAFF[0]; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 60)}>
      <View style={[styles.staffCard, !item.active && styles.staffCardInactive]}>
        <View style={styles.cardTop}>
          <Avatar size={48} initials={item.name.charAt(0)} />
          <View style={styles.infoBox}>
            <Text style={[Typography.titleS, { color: Colors.textPrimary }]}>{item.name}</Text>
            <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{item.role} · {item.experience}</Text>
          </View>
          <View style={styles.statusDotBox}>
            <View style={[styles.statusDot, { backgroundColor: item.active ? Colors.success : Colors.border }]} />
            <Text style={[Typography.caption, { marginLeft: 4, color: item.active ? Colors.success : Colors.textSecondary }]}>
              {item.active ? 'Active' : 'Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={[Typography.caption, { marginLeft: 4, color: Colors.textPrimary, fontWeight: '600' }]}>{item.rating}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="cut-outline" size={14} color={Colors.primary} />
            <Text style={[Typography.caption, { marginLeft: 4, color: Colors.textPrimary }]}>{item.assigned} Services</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={[Typography.label, { color: Colors.primary }]}>Edit Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={[Typography.label, { color: Colors.primary }]}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header 
        title="Staff Management" 
        showBack 
        rightElement={
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="person-add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={STAFF}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: Spacing.l,
    paddingBottom: Spacing.xxxxxl,
  },
  staffCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    ...Shadow.card,
  },
  staffCardInactive: {
    opacity: 0.7,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  infoBox: {
    flex: 1,
    marginLeft: Spacing.m,
  },
  statusDotBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.s,
    borderRadius: Radius.m,
    marginBottom: Spacing.m,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.borderSubtle,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: Spacing.m,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
});
