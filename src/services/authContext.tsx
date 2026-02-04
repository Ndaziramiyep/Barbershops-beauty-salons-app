import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from './apiService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      const loginTimestamp = await AsyncStorage.getItem('loginTimestamp');
      
      if (storedToken && storedUser && loginTimestamp) {
        const currentTime = Date.now();
        const loginTime = parseInt(loginTimestamp);
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
        
        // Check if login is still valid (within 2 days)
        if (currentTime - loginTime < twoDaysInMs) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Login expired, clear stored data
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('loginTimestamp');
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      // Clear corrupted data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('loginTimestamp');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string, newUser: User) => {
    try {
      const loginTimestamp = Date.now().toString();
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem('loginTimestamp', loginTimestamp);
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error('Error storing auth:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('loginTimestamp');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error removing auth:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};