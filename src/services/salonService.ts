import { apiClient } from '../api';

export interface Salon {
  _id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  email: string;
  rating: number;
  image: string;
  services: Service[];
  workingHours: WorkingHours;
  ownerId?: {
    name: string;
    email: string;
    phone: string;
  };
  isApproved: boolean;
  isActive: boolean;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

export interface WorkingHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export const salonService = {
  getAllSalons: async (): Promise<Salon[]> => {
    return apiClient.get('/salons');
  },

  getSalonById: async (id: string): Promise<Salon> => {
    return apiClient.get(`/salons/${id}`);
  },

  getNearbySalons: async (latitude: number, longitude: number, radius: number = 10): Promise<Salon[]> => {
    return apiClient.get(`/salons/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
  },
};