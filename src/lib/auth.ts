const AUTH_KEY = 'car_rental_auth';

import { User } from "@/store/authSlice";

export interface StoredAuthData {
  user: User;
  token: string;
  isAuthenticated: boolean;
}

export const saveAuthData = (data: StoredAuthData) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      token: data.token,
      isAuthenticated: data.isAuthenticated,
    }));

    localStorage.setItem('car_rental_user', JSON.stringify(data.user));
  } catch (error) {
    console.error('Failed to save auth data to localStorage:', error);
  }
};

export const getAuthData = (): StoredAuthData | null => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);

    if (parsed && parsed.token && parsed.user && parsed.isAuthenticated) {
      return parsed;
    }

    if (parsed && parsed.token) {
      const userData = localStorage.getItem('car_rental_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return {
            user,
            token: parsed.token,
            isAuthenticated: true,
          };
        } catch {
          clearAuthData();
          return null;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to get auth data from localStorage:', error);
    return null;
  }
};

export const clearAuthData = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('car_rental_user');
  } catch (error) {
    console.error('Failed to clear auth data from localStorage:', error);
  }
};

export const isTokenValid = (token: string): boolean => {
  if (!token) return false;

  try {
    return token.length > 0;
  } catch (error) {
    return false;
  }
};
