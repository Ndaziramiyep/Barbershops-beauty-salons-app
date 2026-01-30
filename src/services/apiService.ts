const API_BASE_URL = 'http://10.0.2.2:5000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  otp: string;
}

export interface ResendOTPData {
  email: string;
}

class ApiService {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Attempting to register with URL:', `${API_BASE_URL}/auth/register`);
      console.log('Register data:', data);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return result;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('Attempting to login with URL:', `${API_BASE_URL}/auth/login`);
      console.log('Login data:', data);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      return result;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Network request failed');
    }
  }
  async verifyOTP(data: OTPData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'OTP verification failed');
      }

      return result;
    } catch (error: any) {
      throw new Error(error.message || 'OTP verification failed');
    }
  }

  async resendOTP(data: ResendOTPData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to resend OTP');
      }

      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend OTP');
    }
  }
}

export const apiService = new ApiService();