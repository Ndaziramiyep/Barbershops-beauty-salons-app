export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'salon_owner' | 'admin';
  isVerified: boolean;
  salonId?: string;
}

export interface Salon {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  ownerId: User;
  isApproved: boolean;
  isActive: boolean;
  services: Service[];
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Booking {
  _id: string;
  userId: User;
  salonId: Salon;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface DashboardStats {
  totalUsers?: number;
  totalSalons?: number;
  totalBookings?: number;
  pendingSalons?: number;
  todayBookings?: number;
  pendingBookings?: number;
  totalServices?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}