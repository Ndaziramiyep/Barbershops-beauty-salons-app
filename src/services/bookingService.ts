import { apiClient } from '../api';

export interface Booking {
  _id: string;
  userId: string;
  salonId: {
    _id: string;
    name: string;
    address: string;
  };
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  totalPrice: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface CreateBookingData {
  salonId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string;
  time: string;
  notes?: string;
}

export const bookingService = {
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    return apiClient.post('/bookings', data);
  },

  getMyBookings: async (): Promise<Booking[]> => {
    return apiClient.get('/bookings/my-bookings');
  },

  updateBookingStatus: async (bookingId: string, status: string): Promise<Booking> => {
    return apiClient.patch(`/bookings/${bookingId}/status`, { status });
  },
};