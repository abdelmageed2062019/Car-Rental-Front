import axios from "axios";
import { getAuthData } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserDriverLicense {
  number: string;
  expiryDate: string;
  issuingCountry: string;
}

export interface UserPreferences {
  preferredCarTypes: string[];
  preferredFuelType?: string;
  maxDailyBudget?: number;
}

export interface UserRentalHistory {
  rentalId: {
    _id: string;
    startDate: string;
    endDate: string;
    finalAmount: number;
    status: string;
    createdAt: string;
    isActive: boolean;
    isOverdue: boolean;
    canCancel: boolean;
    id: string;
  };
  carId: {
    _id: string;
    name: string;
    brand: string;
    images: string[];
    id: string;
  };
  startDate: string;
  endDate: string;
  totalCost: number;
  status: string;
  _id: string;
  id: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  role: "user" | "admin";
  isActive: boolean;
  isEmailVerified: boolean;
  profileImage: string | null;
  driverLicense: UserDriverLicense;
  address: UserAddress;
  preferences: UserPreferences;
  rentalHistory: UserRentalHistory[];
  createdAt: string;
  updatedAt: string;
  age: number;
  id: string;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  data: User[];
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "user" | "admin";
  isActive?: boolean;
  isEmailVerified?: boolean;
  sortBy?: "createdAt" | "firstName" | "lastName" | "email" | "role";
  sortOrder?: "asc" | "desc";
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  admins: number;
  users: number;
  newThisMonth: number;
}

export interface UserStatsResponse {
  success: boolean;
  data: UserStats;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
  driverLicense?: {
    number?: string;
    expiryDate?: string;
    issuingCountry?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    preferredCarTypes?: string[];
    preferredFuelType?: string;
    maxDailyBudget?: number;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Fetch all users with pagination and filtering
export const fetchAllUsers = async (params: AdminUsersParams = {}): Promise<UsersResponse> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      role, 
      isActive, 
      isEmailVerified, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);

    if (search) queryParams.append('search', search);
    if (role) queryParams.append('role', role);
    if (isActive !== undefined) queryParams.append('isActive', isActive.toString());
    if (isEmailVerified !== undefined) queryParams.append('isEmailVerified', isEmailVerified.toString());

    const url = `${API_URL}/api/admin/users?${queryParams.toString()}`;
    console.log('Fetching users:', url);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Users response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to fetch users');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch users');
    }
  }
};

// Search users with filters
export const searchUsers = async (params: {
  name?: string;
  email?: string;
  role?: "user" | "admin" | "manager";
  isActive?: boolean;
}): Promise<UsersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append('name', params.name);
    if (params.email) queryParams.append('email', params.email);
    if (params.role) queryParams.append('role', params.role);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const url = `${API_URL}/api/admin/users/search?${queryParams.toString()}`;
    console.log('Searching users:', url);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Search users response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error searching users:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to search users');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to search users');
    }
  }
};

// Fetch user by ID
export const fetchUserById = async (userId: string): Promise<UserResponse> => {
  try {
    console.log('Fetching user by ID:', `${API_URL}/api/admin/users/${userId}`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.get(`${API_URL}/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('User by ID response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error fetching user by ID:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to fetch user');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch user');
    }
  }
};

// Update user (general update function)
export const updateUser = async (userId: string, updateData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: "user" | "admin" | "manager";
  isActive?: boolean;
  isEmailVerified?: boolean;
}): Promise<UserResponse> => {
  try {
    console.log('Updating user:', `${API_URL}/api/admin/users/${userId}`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.put(`${API_URL}/api/admin/users/${userId}`, 
      updateData, 
      {
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Update user response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to update user');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to update user');
    }
  }
};

// Update user status (active/inactive)
export const updateUserStatus = async (userId: string, isActive: boolean): Promise<UserResponse> => {
  return updateUser(userId, { isActive });
};

// Update user role
export const updateUserRole = async (userId: string, role: "user" | "admin" | "manager"): Promise<UserResponse> => {
  return updateUser(userId, { role });
};

// Delete user
export const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Deleting user:', `${API_URL}/api/admin/users/${userId}`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Delete user response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to delete user');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to delete user');
    }
  }
};

// Get user statistics
export const getUserStats = async (): Promise<UserStatsResponse> => {
  try {
    console.log('Fetching user stats:', `${API_URL}/api/admin/users/stats`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.get(`${API_URL}/api/admin/users/stats`, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('User stats response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error fetching user stats:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to fetch user stats');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch user stats');
    }
  }
};

// Get user profile
export const getUserProfile = async (): Promise<ProfileResponse> => {
  try {
    console.log('Fetching user profile:', `${API_URL}/api/users/profile`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.get(`${API_URL}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('User profile response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error fetching user profile:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to fetch user profile');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch user profile');
    }
  }
};

// Update user profile
export const updateUserProfile = async (profileData: ProfileUpdateData): Promise<ProfileResponse> => {
  try {
    console.log('Updating user profile:', `${API_URL}/api/users/profile`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.put(`${API_URL}/api/users/profile`, profileData, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Update profile response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error updating user profile:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to update user profile');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to update user profile');
    }
  }
};

// Change user password
export const changePassword = async (passwordData: ChangePasswordData): Promise<ChangePasswordResponse> => {
  try {
    console.log('Changing user password:', `${API_URL}/api/users/change-password`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.put(`${API_URL}/api/users/change-password`, passwordData, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Change password response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error changing password:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to change password');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to change password');
    }
  }
};
