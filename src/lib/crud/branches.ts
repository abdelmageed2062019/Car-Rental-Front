import axios from "axios";
import { getAuthData } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Branch interfaces
export interface BranchLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Branch {
  _id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  location: BranchLocation;
  __v?: number;
}

export interface BranchData {
  name: string;
  address: string;
  city: string;
  country: string;
  location: BranchLocation;
}

export interface BranchResponse {
  success: boolean;
  message: string;
  data: Branch;
}

export interface BranchesResponse {
  success: boolean;
  data: Branch[];
  count: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BranchStats {
  totalBranches: number;
  activeBranches: number;
  branchesByCountry: { [key: string]: number };
  branchesByCity: { [key: string]: number };
}

export interface BranchStatsResponse {
  success: boolean;
  data: BranchStats;
}

// Fetch all branches
export const fetchAllBranches = async (): Promise<BranchesResponse> => {
  try {
    console.log('Fetching branches:', `${API_URL}/api/admin/branches`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.get(`${API_URL}/api/admin/branches`, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Branches response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error fetching branches:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to fetch branches');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch branches');
    }
  }
};

// Fetch branch by ID
export const fetchBranchById = async (branchId: string): Promise<BranchResponse> => {
  try {
    console.log('Fetching branch by ID:', `${API_URL}/api/admin/branches/${branchId}`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.get(`${API_URL}/api/admin/branches/${branchId}`, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Branch response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error fetching branch:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to fetch branch');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch branch');
    }
  }
};

// Create new branch
export const createBranch = async (branchData: BranchData): Promise<BranchResponse> => {
  try {
    console.log('Creating branch:', `${API_URL}/api/admin/branches`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.post(`${API_URL}/api/admin/branches`, branchData, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Create branch response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error creating branch:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to create branch');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to create branch');
    }
  }
};

// Update branch
export const updateBranch = async (branchId: string, updateData: Partial<BranchData>): Promise<BranchResponse> => {
  try {
    console.log('Updating branch:', `${API_URL}/api/admin/branches/${branchId}`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.put(`${API_URL}/api/admin/branches/${branchId}`, updateData, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Update branch response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error updating branch:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to update branch');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to update branch');
    }
  }
};

// Delete branch
export const deleteBranch = async (branchId: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Deleting branch:', `${API_URL}/api/admin/branches/${branchId}`);

    const authData = getAuthData();
    if (!authData || !authData.token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const { data } = await axios.delete(`${API_URL}/api/admin/branches/${branchId}`, {
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Delete branch response:', data);

    return data;
  } catch (error: unknown) {
    console.error('Error deleting branch:', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const responseData = error.response.data as { message?: string; error?: string };
      throw new Error(responseData.message || responseData.error || 'Failed to delete branch');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to delete branch');
    }
  }
};

// Get branch statistics (computed from branches data)
export const getBranchStats = (branches: unknown[]): BranchStats => {
  const totalBranches = branches.length;
  const activeBranches = branches.length; // All branches are considered active for now
  
  const branchesByCountry: { [key: string]: number } = {};
  const branchesByCity: { [key: string]: number } = {};
  
  branches.forEach(branch => {
    branchesByCountry[branch.country] = (branchesByCountry[branch.country] || 0) + 1;
    branchesByCity[branch.city] = (branchesByCity[branch.city] || 0) + 1;
  });
  
  return {
    totalBranches,
    activeBranches,
    branchesByCountry,
    branchesByCity,
  };
};