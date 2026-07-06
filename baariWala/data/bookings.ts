export type QueueStatus = 'waiting' | 'approaching' | 'called' | 'serving' | 'completed' | 'cancelled' | 'expired' | 'standby';

export interface Booking {
  id: string;
  shopName: string;
  shopId: string;
  barberName: string;
  service: string;
  date: string;
  time: string;
  price: number;
  status: QueueStatus;
  tokenNumber: number;
  currentServingToken: number;
  peopleAhead: number;
  estimatedWaitMins: number;
  bookingRef: string;
}

export const DUMMY_BOOKINGS: Booking[] = [
  {
    id: 'bk1',
    shopName: 'Style Zone Salon',
    shopId: '1',
    barberName: 'Rahul V.',
    service: 'Haircut',
    date: '25 May 2024',
    time: '01:00 PM',
    price: 354,
    status: 'waiting',
    tokenNumber: 12,
    currentServingToken: 8,
    peopleAhead: 4,
    estimatedWaitMins: 25,
    bookingRef: 'BW-20240525-001',
  },
  {
    id: 'bk2',
    shopName: 'The Hair Studio',
    shopId: '2',
    barberName: 'Amit K.',
    service: 'Beard Trim',
    date: '20 May 2024',
    time: '11:00 AM',
    price: 150,
    status: 'completed',
    tokenNumber: 5,
    currentServingToken: 5,
    peopleAhead: 0,
    estimatedWaitMins: 0,
    bookingRef: 'BW-20240520-002',
  },
  {
    id: 'bk3',
    shopName: 'Smart Cut Salon',
    shopId: '3',
    barberName: 'Suresh M.',
    service: 'Hair Color',
    date: '15 May 2024',
    time: '03:00 PM',
    price: 800,
    status: 'cancelled',
    tokenNumber: 9,
    currentServingToken: 12,
    peopleAhead: 0,
    estimatedWaitMins: 0,
    bookingRef: 'BW-20240515-003',
  },
  {
    id: 'bk4',
    shopName: 'Style Zone Salon',
    shopId: '1',
    barberName: 'Rahul V.',
    service: 'Haircut',
    date: '30 May 2024',
    time: '05:00 PM',
    price: 354,
    status: 'standby',
    tokenNumber: 7,
    currentServingToken: 3,
    peopleAhead: 4,
    estimatedWaitMins: 40,
    bookingRef: 'BW-20240530-004',
  },
];
