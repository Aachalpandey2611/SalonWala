export interface Barber {
  id: string;
  name: string;
  rating: number;
  experience: string; // e.g. "5 yrs"
  specialization: string;
  imageUrl: string;
  available: boolean;
  currentQueue: number;
}

export const DUMMY_BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Rahul V.',
    rating: 4.9,
    experience: '8 yrs',
    specialization: 'Fades & Styling',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    available: true,
    currentQueue: 2,
  },
  {
    id: 'b2',
    name: 'Amit K.',
    rating: 4.7,
    experience: '5 yrs',
    specialization: 'Beard Expert',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    available: true,
    currentQueue: 0,
  },
  {
    id: 'b3',
    name: 'Suresh M.',
    rating: 4.5,
    experience: '12 yrs',
    specialization: 'Classic Cuts',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    available: false,
    currentQueue: 5,
  }
];
