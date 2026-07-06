export type ShopStatus = 'online' | 'busy' | 'break' | 'closed';

export type ActivityType = 'completed' | 'cancelled' | 'new_booking' | 'walkin' | 'checkin';

export interface BarberStat {
  id: string;
  label: string;
  value: string;
  trend?: string; // e.g. "+12%"
  trendUp?: boolean;
  icon: string;
  colorAccent: string;
}

export interface UpcomingCustomer {
  id: string;
  name: string;
  service: string;
  time: string;
  status: 'waiting' | 'confirmed' | 'in_service';
  tokenNumber: number;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  customerName: string;
  service: string;
  time: string;
  amount?: number;
}

export const SHOP_STATUS_CONFIG: Record<ShopStatus, { label: string; color: string; bg: string }> = {
  online:  { label: 'Online',  color: '#10B981', bg: '#D1FAE5' },
  busy:    { label: 'Busy',    color: '#F59E0B', bg: '#FEF3C7' },
  break:   { label: 'On Break', color: '#6B7280', bg: '#F3F4F6' },
  closed:  { label: 'Closed',  color: '#EF4444', bg: '#FEE2E2' },
};

export const DUMMY_STATS: BarberStat[] = [
  { id: 's1', label: "Today's Earnings", value: '₹4,520', trend: '+18%', trendUp: true,  icon: 'cash-outline',           colorAccent: '#10B981' },
  { id: 's2', label: 'Customers Served', value: '18',     trend: '+3',   trendUp: true,  icon: 'people-outline',         colorAccent: '#1A1A2E' },
  { id: 's3', label: 'Pending Queue',    value: '6',      trend: undefined, trendUp: undefined, icon: 'list-outline',    colorAccent: '#FF6B35' },
  { id: 's4', label: 'Walk-ins',         value: '4',      trend: undefined, trendUp: undefined, icon: 'walk-outline',    colorAccent: '#6B7280' },
  { id: 's5', label: 'Completion Rate',  value: '94%',    trend: '+2%',  trendUp: true,  icon: 'checkmark-circle-outline', colorAccent: '#10B981' },
  { id: 's6', label: 'Avg. Wait Time',   value: '14 min', trend: '-3m',  trendUp: true,  icon: 'time-outline',          colorAccent: '#FF6B35' },
];

export const DUMMY_REVENUE = [
  { period: 'Today',   amount: '₹4,520' },
  { period: 'This Week', amount: '₹24,180' },
  { period: 'This Month', amount: '₹88,400' },
];

export const DUMMY_UPCOMING: UpcomingCustomer[] = [
  { id: 'u1', name: 'Rahul Verma',   service: 'Haircut',     time: '01:00 PM', status: 'in_service', tokenNumber: 8  },
  { id: 'u2', name: 'Amit Kumar',    service: 'Beard Trim',  time: '01:30 PM', status: 'waiting',    tokenNumber: 9  },
  { id: 'u3', name: 'Sandeep Yadav', service: 'Hair Color',  time: '02:00 PM', status: 'confirmed',  tokenNumber: 10 },
  { id: 'u4', name: 'Rohit Sharma',  service: 'Haircut',     time: '02:30 PM', status: 'confirmed',  tokenNumber: 11 },
];

export const DUMMY_ACTIVITY: ActivityItem[] = [
  { id: 'a1', type: 'completed',   customerName: 'Vikas Patel',   service: 'Haircut',    time: '12:45 PM', amount: 300 },
  { id: 'a2', type: 'new_booking', customerName: 'Rohit Sharma',  service: 'Haircut',    time: '12:30 PM' },
  { id: 'a3', type: 'walkin',      customerName: 'Walk-in #4',    service: 'Beard Trim', time: '12:15 PM', amount: 150 },
  { id: 'a4', type: 'checkin',     customerName: 'Amit Kumar',    service: 'Beard Trim', time: '12:00 PM' },
  { id: 'a5', type: 'cancelled',   customerName: 'Priya Singh',   service: 'Hair Color', time: '11:45 AM' },
];
