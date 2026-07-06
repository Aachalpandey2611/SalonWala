import { useState, useCallback } from 'react';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  active: boolean;
}

const DUMMY_SERVICES: ServiceItem[] = [
  { id: '1', name: 'Classic Haircut', category: 'Hair', price: '₹300', duration: '30 min', active: true },
  { id: '2', name: 'Beard Trim & Shape', category: 'Beard', price: '₹150', duration: '15 min', active: true },
  { id: '3', name: 'Hair Color (Global)', category: 'Color', price: '₹800', duration: '60 min', active: true },
  { id: '4', name: 'Facial Massage', category: 'Spa', price: '₹500', duration: '45 min', active: false },
  { id: '5', name: 'Hair Wash & Styling', category: 'Hair', price: '₹200', duration: '20 min', active: true },
];

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>(DUMMY_SERVICES);
  const [isLoading, setIsLoading] = useState(false);

  // Example of future async fetching abstraction
  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    // await fetch('/api/services')
    setIsLoading(false);
  }, []);

  return {
    services,
    isLoading,
    fetchServices,
  };
}
