import { QueueStatus } from '../data/bookings';
import { Colors } from './theme';

export const QUEUE_STATUS_CONFIG: Record<
  QueueStatus,
  { label: string; color: string; background: string; description: string }
> = {
  waiting: {
    label: 'Waiting',
    color: Colors.warning,
    background: Colors.warningSoft,
    description: 'You are in the queue. We will notify you when it\'s your turn.',
  },
  approaching: {
    label: 'Almost There!',
    color: Colors.accent,
    background: Colors.accentSoft,
    description: 'You are next! Please head to the shop now.',
  },
  called: {
    label: 'Your Turn!',
    color: Colors.success,
    background: Colors.successSoft,
    description: 'You have been called. Please proceed to the barber.',
  },
  serving: {
    label: 'In Service',
    color: Colors.primary,
    background: '#E8EAF6',
    description: 'You are currently being served.',
  },
  completed: {
    label: 'Completed',
    color: Colors.success,
    background: Colors.successSoft,
    description: 'Your appointment has been successfully completed.',
  },
  cancelled: {
    label: 'Cancelled',
    color: Colors.error,
    background: Colors.errorSoft,
    description: 'This booking has been cancelled.',
  },
  expired: {
    label: 'Expired',
    color: Colors.textTertiary,
    background: Colors.borderSubtle,
    description: 'This token has expired. Please rebook.',
  },
  standby: {
    label: 'Upcoming',
    color: Colors.primary,
    background: '#E8EAF6',
    description: 'Your booking is confirmed and upcoming.',
  },
};
