import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ALL_QUEUES = [
  { id: 'q1', token: 8, customer: 'Amit K.', barber: 'Rahul Verma', service: 'Haircut', wait: '15m' },
  { id: 'q2', token: 9, customer: 'Sandeep Y.', barber: 'Sandeep Yadav', service: 'Color', wait: '25m' },
  { id: 'q3', token: 10, customer: 'Walk-in', barber: 'Any Available', service: 'Beard', wait: '5m' },
  { id: 'q4', token: 11, customer: 'Rohit S.', barber: 'Rahul Verma', service: 'Haircut', wait: '30m' },
];

export default function QueueOverviewScreen() {
  const [filter, setFilter] = useState('All');

  const renderItem = ({ item, index }: { item: typeof ALL_QUEUES[0], index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
      <View style={styles.queueCard}>
        <View style={styles.tokenBox}>
          <Text style={[Typography.titleM, { color: Colors.accent }]}>#{item.token}</Text>
        </View>
        <View style={styles.queueInfo}>
          <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600' }]}>{item.customer}</Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{item.service}</Text>
          <View style={styles.barberTag}>
            <Ionicons name="cut" size={10} color={Colors.primary} />
            <Text style={[Typography.caption, { color: Colors.primary, fontSize: 10, marginLeft: 4 }]}>{item.barber}</Text>
          </View>
        </View>
        <View style={styles.waitBox}>
          <Ionicons name="time-outline" size={16} color={Colors.warning} />
          <Text style={[Typography.titleS, { color: Colors.textPrimary, marginLeft: 4 }]}>{item.wait}</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header title="Master Queue" showBack />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Total Waiting</Text>
          <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>14</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Avg Wait</Text>
          <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>18m</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>Longest Wait</Text>
          <Text style={[Typography.titleM, { color: Colors.error }]}>42m</Text>
        </View>
      </View>

      <View style={styles.filterScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.l }}>
          {['All', 'Rahul Verma', 'Sandeep Yadav', 'Vijay Patil', 'Unassigned'].map(f => (
            <TouchableOpacity 
              key={f} 
              onPress={() => setFilter(f)}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
            >
              <Text style={[Typography.caption, { color: filter === f ? Colors.surface : Colors.textSecondary, fontWeight: filter === f ? '600' : '400' }]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={ALL_QUEUES}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderSubtle,
  },
  filterScroll: {
    paddingVertical: Spacing.m,
    backgroundColor: Colors.background,
  },
  filterChip: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surface,
    marginRight: Spacing.s,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  listContent: {
    padding: Spacing.l,
    paddingBottom: Spacing.xxxxxl,
  },
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: Radius.l,
    marginBottom: Spacing.s,
    ...Shadow.card,
  },
  tokenBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.m,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  queueInfo: {
    flex: 1,
  },
  barberTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EAF6',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  waitBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
