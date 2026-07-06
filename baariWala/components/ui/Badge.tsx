import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { Colors, Radius, Typography } from '../../constants/theme';

export type BadgeStatus = 
  | 'waiting' 
  | 'called' 
  | 'serving' 
  | 'standby' 
  | 'noshow' 
  | 'booked';

interface BadgeProps extends ViewProps {
  label: string;
  status: BadgeStatus;
}

export const Badge: React.FC<BadgeProps> = ({ label, status, style, ...props }) => {
  const getBadgeColors = () => {
    switch (status) {
      case 'waiting':
        return { bg: Colors.warningSoft, text: Colors.statusWaiting };
      case 'called':
      case 'booked':
        return { bg: Colors.infoSoft, text: Colors.statusCalled };
      case 'serving':
        return { bg: Colors.successSoft, text: Colors.statusServing };
      case 'standby':
        return { bg: '#EDE9FE', text: Colors.statusStandby }; // Soft purple
      case 'noshow':
        return { bg: Colors.errorSoft, text: Colors.statusNoShow };
      default:
        return { bg: Colors.borderSubtle, text: Colors.textSecondary };
    }
  };

  const colors = getBadgeColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        style,
      ]}
      {...props}
    >
      <Text style={[Typography.label, { color: colors.text, textTransform: 'uppercase' }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
