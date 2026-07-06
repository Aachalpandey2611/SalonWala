import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../components/shared/ScreenWrapper';
import { Header } from '../../../components/ui/Header';
import { Input } from '../../../components/ui/Input';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TRANSACTIONS = [
  { id: '1', date: 'Today, 12:45 PM', amount: '₹300', service: 'Haircut', customer: 'Rahul V.', status: 'Completed', method: 'UPI' },
  { id: '2', date: 'Today, 11:30 AM', amount: '₹150', service: 'Beard Trim', customer: 'Amit K.', status: 'Completed', method: 'Cash' },
  { id: '3', date: 'Today, 10:00 AM', amount: '₹800', service: 'Hair Color', customer: 'Sandeep Y.', status: 'Failed', method: 'Card' },
  { id: '4', date: 'Yesterday, 06:15 PM', amount: '₹300', service: 'Haircut', customer: 'Walk-in', status: 'Completed', method: 'Cash' },
  { id: '5', date: 'Yesterday, 05:00 PM', amount: '₹500', service: 'Facial', customer: 'Vijay P.', status: 'Completed', method: 'UPI' },
];

export default function TransactionsScreen() {
  const [search, setSearch] = useState('');

  const renderItem = ({ item, index }: { item: typeof TRANSACTIONS[0], index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
      <View style={styles.txnCard}>
        <View style={styles.txnIconBox}>
          <Ionicons 
            name={item.status === 'Completed' ? 'checkmark-circle' : 'close-circle'} 
            size={24} 
            color={item.status === 'Completed' ? Colors.success : Colors.error} 
          />
        </View>
        <View style={styles.txnInfo}>
          <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600' }]}>{item.service}</Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>{item.customer} · {item.method}</Text>
          <Text style={[Typography.caption, { color: Colors.textTertiary, marginTop: 2 }]}>{item.date}</Text>
        </View>
        <Text style={[Typography.titleS, { color: item.status === 'Completed' ? Colors.textPrimary : Colors.error }]}>
          {item.amount}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <ScreenWrapper backgroundColor={Colors.background} usePadding={false}>
      <Header 
        title="Transactions" 
        showBack 
      />

      <View style={styles.searchContainer}>
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search customer, service..."
          leftIcon={<Ionicons name="search" size={20} color={Colors.textTertiary} />}
          containerStyle={{ marginBottom: 0 }}
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={TRANSACTIONS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
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
  },
  txnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: Radius.l,
    marginBottom: Spacing.s,
    ...Shadow.card,
  },
  txnIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  txnInfo: {
    flex: 1,
  },
});
