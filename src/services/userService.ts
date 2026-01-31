import { apiClient } from '../api';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isOnline?: boolean;
}

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    return apiClient.get('/users');
  },

  getUserById: async (id: string): Promise<User> => {
    return apiClient.get(`/users/${id}`);
  },
};