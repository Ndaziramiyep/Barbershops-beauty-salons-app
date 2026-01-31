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
  services: Array<{
    name: string;
    price: number;
    duration: number;
  }>;
  workingHours: {
    [key: string]: { open: string; close: string };
  };
}

export const salonService = {
  getAllSalons: async (): Promise<Salon[]> => {
    return apiClient.get('/salons');
  },

  getNearbySalons: async (latitude: number, longitude: number, radius = 10): Promise<Salon[]> => {
    return apiClient.get(`/salons/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
  },

  getSalonById: async (id: string): Promise<Salon> => {
    return apiClient.get(`/salons/${id}`);
  },
};