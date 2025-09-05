import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import { getAuthData } from "@/lib/auth";

const loadAuthState = () => {
     const authData = getAuthData();
     if (authData && authData.isAuthenticated && authData.user && authData.token) {
          return {
               auth: {
                    user: authData.user,
                    token: authData.token,
                    isAuthenticated: true,
                    loading: false,
                    error: null,
               },
          };
     }
     return undefined;
};

export const store = configureStore({
     reducer: {
          auth: authReducer,
     },
     preloadedState: loadAuthState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;