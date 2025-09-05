export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const AUTH_ENDPOINTS = {
     LOGIN: `${API_BASE_URL}/api/users/login`,
     REGISTER: `${API_BASE_URL}/api/users/register`,
     LOGOUT: `${API_BASE_URL}/api/users/logout`,
     REFRESH: `${API_BASE_URL}/api/users/refresh`,
} as const;

export const buildApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
