export type QueueItemStatus = 'serving' | 'called' | 'waiting' | 'standby' | 'no_show' | 'completed' | 'cancelled';
export type QueueItemSource = 'booking' | 'walkin';

export interface QueueItem {
  id: string;
  tokenNumber: number;
  customerName: string;
  phone: string;
  service: string;
  serviceDuration: number; // minutes
  waitingSince: string; // e.g. "01:05 PM"
  estimatedStart: string; // e.g. "01:35 PM"
  status: QueueItemStatus;
  source: QueueItemSource;
  checkedIn: boolean;
  notes?: string;
}

export const STATUS_STYLE: Record<QueueItemStatus, { label: string; color: string; bg: string; icon: string }> = {
  serving:   { label: 'Serving',   color: '#10B981', bg: '#D1FAE5', icon: 'cut' },
  called:    { label: 'Called',    color: '#FF6B35', bg: '#FFF0EB', icon: 'megaphone' },
  waiting:   { label: 'Waiting',   color: '#F59E0B', bg: '#FEF3C7', icon: 'time' },
  standby:   { label: 'Standby',   color: '#6B7280', bg: '#F3F4F6', icon: 'pause-circle' },
  no_show:   { label: 'No Show',   color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle' },
  completed: { label: 'Completed', color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-circle' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2', icon: 'ban' },
};

export const DUMMY_QUEUE: QueueItem[] = [
  {
    id: 'q1',
    tokenNumber: 8,
    customerName: 'Rahul Verma',
    phone: '+91 98765 43210',
    service: 'Haircut',
    serviceDuration: 30,
    waitingSince: '12:30 PM',
    estimatedStart: '01:00 PM',
    status: 'serving',
    source: 'booking',
    checkedIn: true,
    notes: 'Prefers medium fade.',
  },
  {
    id: 'q2',
    tokenNumber: 9,
    customerName: 'Amit Kumar',
    phone: '+91 97654 32109',
    service: 'Beard Trim',
    serviceDuration: 15,
    waitingSince: '12:45 PM',
    estimatedStart: '01:30 PM',
    status: 'waiting',
    source: 'booking',
    checkedIn: true,
  },
  {
    id: 'q3',
    tokenNumber: 10,
    customerName: 'Sandeep Yadav',
    phone: '+91 96543 21098',
    service: 'Hair Color',
    serviceDuration: 60,
    waitingSince: '01:00 PM',
    estimatedStart: '01:45 PM',
    status: 'waiting',
    source: 'walkin',
    checkedIn: false,
  },
  {
    id: 'q4',
    tokenNumber: 11,
    customerName: 'Rohit Sharma',
    phone: '+91 95432 10987',
    service: 'Haircut',
    serviceDuration: 30,
    waitingSince: '01:05 PM',
    estimatedStart: '02:45 PM',
    status: 'waiting',
    source: 'booking',
    checkedIn: false,
  },
  {
    id: 'q5',
    tokenNumber: 12,
    customerName: 'Vijay Patil',
    phone: '+91 94321 09876',
    service: 'Beard Trim',
    serviceDuration: 15,
    waitingSince: '01:10 PM',
    estimatedStart: '03:15 PM',
    status: 'standby',
    source: 'walkin',
    checkedIn: false,
  },
];
