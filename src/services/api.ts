import axios from 'axios';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

// Create an instance of axios
const api = axios.create({
    baseURL: 'http://localhost:8888/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/admin/auth/login', credentials);
        return response.data;
    }
};

// Export the API instance
export default api;
