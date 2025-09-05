import axios from "axios";
import { getAuthData } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface CreateRentalData {
     carId: string;
     startDate: string;
     endDate: string;
     pickup: {
          location: string;
          branch: string;
          time: string;
     };
     return: {
          location: string;
          branch: string;
          time: string;
     };
     driverInfo: {
          licenseNumber: string;
          licenseExpiry: string;
     };
     carCondition: {
          pickup: {
               mileage: number;
          };
     };
     specialRequests: string;
     payment: {
          method: string;
     };
}

export interface RentalData {
     userId: {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
          age: number | null;
          id: string;
     };
     carId: {
          _id: string;
          name: string;
          brand: string;
          images: string[];
     };
     startDate: string;
     endDate: string;
     duration: number;
     pricePerDay: number;
     totalPrice: number;
     additionalFees: {
          insurance: number;
          fuel: number;
          cleaning: number;
          lateReturn: number;
     };
     finalAmount: number;
     status: string;
     payment: {
          method: string;
          status: string;
          transactionId: string | null;
          paidAt: string | null;
     };
     pickup: {
          location: string;
          branch: {
               _id: string;
               name: string;
               address: string;
               city: string;
          };
          time: string;
          notes: string;
     };
     return: {
          location: string;
          branch: {
               _id: string;
               name: string;
               address: string;
               city: string;
          };
          time: string;
          notes: string;
          actualReturnTime: string | null;
     };
     carCondition: {
          pickup: {
               fuelLevel: number | null;
               mileage: number | null;
               exterior: string | null;
               interior: string | null;
               photos: string[];
          };
          return: {
               fuelLevel: number | null;
               mileage: number | null;
               exterior: string | null;
               interior: string | null;
               photos: string[];
               damageReport: string;
          };
     };
     driverInfo: {
          licenseNumber: string;
          licenseExpiry: string;
          additionalDrivers: string[];
     };
     insurance: {
          type: string;
          coverage: number;
          deductible: number;
     };
     cancellationPolicy: {
          allowed: boolean;
          deadline: string | null;
          refundPercentage: number;
     };
     specialRequests: string;
     adminNotes: string;
     confirmedAt: string | null;
     activatedAt: string | null;
     completedAt: string | null;
     cancelledAt: string | null;
     _id: string;
     createdAt: string;
     updatedAt: string;
     __v: number;
     isActive: boolean;
     isOverdue: boolean;
     canCancel: boolean;
     id: string;
}

export interface RentalResponse {
     success: boolean;
     message: string;
     data?: RentalData;
}

export const createRental = async (rentalData: CreateRentalData): Promise<RentalResponse> => {
     try {
          console.log('Creating rental:', `${API_URL}/api/rentals`);
          console.log('Rental data:', rentalData);

          const authData = getAuthData();
          if (!authData || !authData.token) {
               throw new Error('Authentication token not found. Please log in again.');
          }

          const { data } = await axios.post(`${API_URL}/api/rentals`, rentalData, {
               headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
               }
          });
          console.log('Rental response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error creating rental:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to create rental');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to create rental');
          }
     }
};

export interface RentalsResponse {
     success: boolean;
     message: string;
     count: number;
     data: RentalData[];
}

export const fetchUserRentals = async (page: number = 1, limit: number = 10): Promise<RentalsResponse> => {
     try {
          console.log('Fetching user rentals:', `${API_URL}/api/rentals?page=${page}&limit=${limit}`);

          const authData = getAuthData();
          if (!authData || !authData.token) {
               throw new Error('Authentication token not found. Please log in again.');
          }

          const { data } = await axios.get(`${API_URL}/api/rentals?page=${page}&limit=${limit}`, {
               headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
               }
          });
          console.log('User rentals response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error fetching user rentals:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to fetch rentals');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to fetch rentals');
          }
     }
};

// Admin rental management functions
export interface AdminRentalsParams {
     page?: number;
     limit?: number;
     status?: string;
     userId?: string;
     carId?: string;
     startDate?: string;
     endDate?: string;
     sortBy?: string;
     sortOrder?: 'asc' | 'desc';
}

export interface AdminRentalsResponse {
     success: boolean;
     message: string;
     count: number;
     totalPages: number;
     currentPage: number;
     data: RentalData[];
}

export const fetchAllRentals = async (params: AdminRentalsParams = {}): Promise<AdminRentalsResponse> => {
     try {
          const {
               page = 1,
               limit = 10,
               status,
               userId,
               carId,
               startDate,
               endDate,
               sortBy = 'createdAt',
               sortOrder = 'desc'
          } = params;

          const queryParams = new URLSearchParams();
          queryParams.append('page', page.toString());
          queryParams.append('limit', limit.toString());
          queryParams.append('sortBy', sortBy);
          queryParams.append('sortOrder', sortOrder);

          if (status) queryParams.append('status', status);
          if (userId) queryParams.append('userId', userId);
          if (carId) queryParams.append('carId', carId);
          if (startDate) queryParams.append('startDate', startDate);
          if (endDate) queryParams.append('endDate', endDate);

          const url = `${API_URL}/api/admin/rentals?${queryParams.toString()}`;
          console.log('Fetching all rentals:', url);

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
          console.log('All rentals response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error fetching all rentals:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to fetch rentals');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to fetch rentals');
          }
     }
};

export const fetchRentalById = async (rentalId: string): Promise<RentalResponse> => {
     try {
          console.log('Fetching rental by ID:', `${API_URL}/api/admin/rentals/${rentalId}`);

          const authData = getAuthData();
          if (!authData || !authData.token) {
               throw new Error('Authentication token not found. Please log in again.');
          }

          const { data } = await axios.get(`${API_URL}/api/admin/rentals/${rentalId}`, {
               headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
               }
          });
          console.log('Rental by ID response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error fetching rental by ID:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to fetch rental');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to fetch rental');
          }
     }
};

export const updateRentalStatus = async (rentalId: string, status: string, adminNotes?: string): Promise<RentalResponse> => {
     try {
          console.log('Updating rental status:', `${API_URL}/api/admin/rentals/${rentalId}/status`);

          const authData = getAuthData();
          if (!authData || !authData.token) {
               throw new Error('Authentication token not found. Please log in again.');
          }

          const updateData: unknown = { status };
          if (adminNotes) updateData.adminNotes = adminNotes;

          const { data } = await axios.patch(`${API_URL}/api/admin/rentals/${rentalId}/status`, updateData, {
               headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
               }
          });
          console.log('Update rental status response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error updating rental status:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to update rental status');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to update rental status');
          }
     }
};

export const activateRental = async (rentalId: string): Promise<RentalResponse> => {
     try {
          console.log('Activating rental:', `${API_URL}/api/rentals/${rentalId}/activate`);

          const authData = getAuthData();
          if (!authData || !authData.token) {
               throw new Error('Authentication token not found. Please log in again.');
          }

          const { data } = await axios.patch(`${API_URL}/api/rentals/${rentalId}/activate`, {}, {
               headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
               }
          });
          console.log('Activate rental response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error activating rental:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to activate rental');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to activate rental');
          }
     }
};

export const completeRental = async (rentalId: string, returnData?: unknown): Promise<RentalResponse> => {
     try {
          console.log('Completing rental:', `${API_URL}/api/admin/rentals/${rentalId}/complete`);

          const authData = getAuthData();
          if (!authData || !authData.token) {
               throw new Error('Authentication token not found. Please log in again.');
          }

          const { data } = await axios.patch(`${API_URL}/api/admin/rentals/${rentalId}/complete`, returnData || {}, {
               headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
               }
          });
          console.log('Complete rental response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error completing rental:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to complete rental');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to complete rental');
          }
     }
};

export const cancelRental = async (rentalId: string, reason?: string): Promise<RentalResponse> => {
     try {
          console.log('Cancelling rental:', `${API_URL}/api/admin/rentals/${rentalId}/cancel`);

          const authData = getAuthData();
          if (!authData || !authData.token) {
               throw new Error('Authentication token not found. Please log in again.');
          }

          const cancelData: unknown = {};
          if (reason) cancelData.reason = reason;

          const { data } = await axios.patch(`${API_URL}/api/admin/rentals/${rentalId}/cancel`, cancelData, {
               headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
               }
          });
          console.log('Cancel rental response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error cancelling rental:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to cancel rental');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to cancel rental');
          }
     }
};

export const deleteRental = async (rentalId: string): Promise<{ success: boolean; message: string }> => {
     try {
          console.log('Deleting rental:', `${API_URL}/api/admin/rentals/${rentalId}`);

          const authData = getAuthData();
          if (!authData || !authData.token) {
               throw new Error('Authentication token not found. Please log in again.');
          }

          const { data } = await axios.delete(`${API_URL}/api/admin/rentals/${rentalId}`, {
               headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
               }
          });
          console.log('Delete rental response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error deleting rental:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to delete rental');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to delete rental');
          }
     }
};

export const getRentalStats = async (): Promise<{
     success: boolean;
     data: {
          total: number;
          active: number;
          completed: number;
          cancelled: number;
          pending: number;
          overdue: number;
          totalRevenue: number;
          monthlyRevenue: number;
     };
}> => {
     try {
          console.log('Fetching rental stats:', `${API_URL}/api/admin/rentals/stats`);

          const authData = getAuthData();
          if (!authData || !authData.token) {
               throw new Error('Authentication token not found. Please log in again.');
          }

          const { data } = await axios.get(`${API_URL}/api/admin/rentals/stats`, {
               headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'application/json'
               }
          });
          console.log('Rental stats response:', data);

          return data;
     } catch (error: unknown) {
          console.error('Error fetching rental stats:', error);
          if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
               const responseData = error.response.data as { message?: string; error?: string };
               throw new Error(responseData.message || responseData.error || 'Failed to fetch rental stats');
          } else if (error instanceof Error) {
               throw new Error(error.message);
          } else {
               throw new Error('Failed to fetch rental stats');
          }
     }
};
