import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveAuthData, clearAuthData } from "@/lib/auth";

interface DriverLicense {
     number: string;
     expiryDate: string;
     issuingCountry: string;
}

interface Address {
     street: string;
     city: string;
     state: string;
     zipCode: string;
     country: string;
}



interface User {
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
     driverLicense: DriverLicense;
     address: Address;
     preferences?: {
          preferredCarTypes: string[];
          preferredFuelType?: string;
          maxDailyBudget?: number;
     };
     rentalHistory?: unknown[];
     createdAt: string;
     updatedAt: string;
     age: number;
     id: string;
     [key: string]: string | number | boolean | null | undefined | DriverLicense | Address | unknown;
}


interface AuthState {
     user: User | null;
     token: string | null;
     isAuthenticated: boolean;
     loading: boolean;
     error: string | null;
}

const initialState: AuthState = {
     user: null,
     token: null,
     isAuthenticated: false,
     loading: false,
     error: null,
};

const authSlice = createSlice({
     name: "auth",
     initialState,
     reducers: {
          registerStart: (state) => {
               state.loading = true;
               state.error = null;
          },
          registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
               state.loading = false;
               state.user = action.payload.user;
               state.token = action.payload.token;
               state.isAuthenticated = true;
               state.error = null;

               saveAuthData({
                    user: action.payload.user,
                    token: action.payload.token,
                    isAuthenticated: true,
               });
          },
          registerFailure: (state, action: PayloadAction<string>) => {
               state.loading = false;
               state.error = action.payload;
          },

          loginStart: (state) => {
               state.loading = true;
               state.error = null;
          },
          loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
               state.loading = false;
               state.user = action.payload.user;
               state.token = action.payload.token;
               state.isAuthenticated = true;
               state.error = null;

               saveAuthData({
                    user: action.payload.user,
                    token: action.payload.token,
                    isAuthenticated: true,
               });
          },
          loginFailure: (state, action: PayloadAction<string>) => {
               state.loading = false;
               state.error = action.payload;
          },

          logout: (state) => {
               state.user = null;
               state.token = null;
               state.isAuthenticated = false;
               state.loading = false;
               state.error = null;

               // Clear from localStorage
               clearAuthData();
          },

          updateUserStart: (state) => {
               state.loading = true;
               state.error = null;
          },
          updateUserSuccess: (state, action: PayloadAction<User>) => {
               state.loading = false;
               state.user = action.payload;
               state.error = null;

               // Update localStorage with the new user data
               saveAuthData({
                    user: action.payload,
                    token: state.token,
                    isAuthenticated: state.isAuthenticated,
               });
          },
          updateUserFailure: (state, action: PayloadAction<string>) => {
               state.loading = false;
               state.error = action.payload;
          },

          clearError: (state) => {
               state.error = null;
          },

          setLoading: (state, action: PayloadAction<boolean>) => {
               state.loading = action.payload;
          },
     },
});

export const {
     registerStart,
     registerSuccess,
     registerFailure,
     loginStart,
     loginSuccess,
     loginFailure,
     logout,
     updateUserStart,
     updateUserSuccess,
     updateUserFailure,
     clearError,
     setLoading,
} = authSlice.actions;

export type { User };

export default authSlice.reducer;

