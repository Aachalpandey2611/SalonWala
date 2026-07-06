export interface Shop {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  waitMins: number;
  imageUrl: string;
  isRecommended: boolean;
  isOpen: boolean;
}

export const DUMMY_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Style Zone Salon',
    rating: 4.8,
    reviewCount: 128,
    distance: '500 m',
    waitMins: 25,
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80',
    isRecommended: true,
    isOpen: true,
  },
  {
    id: '2',
    name: 'The Hair Studio',
    rating: 4.5,
    reviewCount: 89,
    distance: '1.2 km',
    waitMins: 15,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
    isRecommended: true,
    isOpen: true,
  },
  {
    id: '3',
    name: 'Smart Cut Salon',
    rating: 4.7,
    reviewCount: 210,
    distance: '2.5 km',
    waitMins: 45,
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80',
    isRecommended: false,
    isOpen: true,
  },
  {
    id: '4',
    name: 'Classic Cuts',
    rating: 4.2,
    reviewCount: 45,
    distance: '3.0 km',
    waitMins: 5,
    imageUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=400&q=80',
    isRecommended: false,
    isOpen: false,
  },
];
