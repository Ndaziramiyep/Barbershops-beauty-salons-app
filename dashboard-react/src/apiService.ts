import axios from 'axios';
import { User, Salon, Booking, DashboardStats, AuthResponse, Service } from './types';

const API_BASE = 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return response.data;
  }

  // Admin APIs
  async getAdminStats(): Promise<DashboardStats> {
    const response = await axios.get(`${API_BASE}/admin/dashboard/stats`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await axios.get(`${API_BASE}/admin/users`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getAllSalons(): Promise<Salon[]> {
    const response = await axios.get(`${API_BASE}/admin/salons`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getAdminBookings(): Promise<Booking[]> {
    const response = await axios.get(`${API_BASE}/admin/bookings`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async approveSalon(salonId: string, isApproved: boolean): Promise<void> {
    await axios.patch(`${API_BASE}/admin/salons/${salonId}/approval`, 
      { isApproved }, 
      { headers: this.getHeaders() }
    );
  }

  async deleteUser(userId: string): Promise<void> {
    await axios.delete(`${API_BASE}/admin/users/${userId}`, {
      headers: this.getHeaders()
    });
  }

  async deleteSalon(salonId: string): Promise<void> {
    await axios.delete(`${API_BASE}/admin/salons/${salonId}`, {
      headers: this.getHeaders()
    });
  }

  // Salon Owner APIs
  async getSalonOwnerStats(): Promise<DashboardStats> {
    const response = await axios.get(`${API_BASE}/salon-owner/dashboard/stats`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getSalonProfile(): Promise<Salon> {
    const response = await axios.get(`${API_BASE}/salon-owner/profile`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateSalonProfile(data: Partial<Salon>): Promise<Salon> {
    const response = await axios.put(`${API_BASE}/salon-owner/profile`, data, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getSalonBookings(): Promise<Booking[]> {
    const response = await axios.get(`${API_BASE}/salon-owner/bookings`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    await axios.patch(`${API_BASE}/salon-owner/bookings/${bookingId}/status`, 
      { status }, 
      { headers: this.getHeaders() }
    );
  }

  async addService(service: Omit<Service, '_id'>): Promise<Salon> {
    const response = await axios.post(`${API_BASE}/salon-owner/services`, service, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateService(serviceId: string, service: Partial<Service>): Promise<Salon> {
    const response = await axios.put(`${API_BASE}/salon-owner/services/${serviceId}`, service, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteService(serviceId: string): Promise<Salon> {
    const response = await axios.delete(`${API_BASE}/salon-owner/services/${serviceId}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }
}

export const apiService = new ApiService();