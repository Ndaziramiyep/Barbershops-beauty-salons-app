export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Salon {
  id: string;
  name: string;
  address: string;
  rating: number;
  image: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Booking {
  id: string;
  salonId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}