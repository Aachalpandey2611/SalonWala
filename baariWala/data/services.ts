export interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  description: string;
}

export const DUMMY_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Haircut',
    duration: 30,
    price: 300,
    description: 'Classic or modern haircut with wash and styling.',
  },
  {
    id: 's2',
    name: 'Beard Trim',
    duration: 15,
    price: 150,
    description: 'Precision beard shaping and trimming.',
  },
  {
    id: 's3',
    name: 'Hair Color',
    duration: 60,
    price: 800,
    description: 'Full hair coloring with premium products.',
  },
  {
    id: 's4',
    name: 'Facial',
    duration: 45,
    price: 500,
    description: 'Deep cleansing and relaxing facial.',
  }
];
