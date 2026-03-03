import type { LoginCredentials, AuthResponse, RegisterCredentials, User } from '../types/index';
import apiClient from './config';

export const authApi = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/login', credentials);
        return response.data;
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/register', credentials);
        return response.data;
    },

    async getMe(): Promise<User> {
        const response = await apiClient.get('/api/auth/me');
        return response.data;
    },
};