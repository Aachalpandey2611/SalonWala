import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { ActivityItem, ActivityType } from '../../data/barber-stats';

const ACTIVITY_CONFIG: Record<ActivityType, { icon: string; color: string; bg: string; prefix: string }> = {
  completed:   { icon: 'checkmark-circle', color: Colors.success,       bg: Colors.successSoft, prefix: 'Completed' },
  cancelled:   { icon: 'close-circle',     color: Colors.error,         bg: Colors.errorSoft,   prefix: 'Cancelled' },
  new_booking: { icon: 'calendar',         color: Colors.primary,       bg: '#E8EAF6',          prefix: 'New Booking' },
  walkin:      { icon: 'walk',             color: Colors.accent,        bg: Colors.accentSoft,  prefix: 'Walk-in' },
  checkin:     { icon: 'log-in',           color: Colors.warning,       bg: Colors.warningSoft, prefix: 'Checked In' },
};

interface ActivityRowProps {
  item: ActivityItem;
}

export const ActivityRow: React.FC<ActivityRowProps> = ({ item }) => {
  const config = ACTIVITY_CONFIG[item.type];

  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon as any} size={18} color={config.color} />
      </View>

      <View style={styles.content}>
        <Text style={[Typography.bodyM, { color: Colors.textPrimary }]}>
          <Text style={{ fontWeight: '600' }}>{item.customerName}</Text>
          {` · ${item.service}`}
        </Text>
        <Text style={[Typography.caption, { color: Colors.textTertiary, marginTop: 2 }]}>
          {config.prefix} · {item.time}
        </Text>
      </View>

      {item.amount !== undefined && (
        <Text style={[Typography.titleS, { color: Colors.success }]}>
          +₹{item.amount}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  content: {
    flex: 1,
  },
});
