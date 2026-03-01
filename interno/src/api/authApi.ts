import type { LoginCredentials, AuthResponse } from '../types/index';
import apiClient from './config';

export const authApi = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/login', credentials);
        return response.data;
    },
    async refresh(): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/refresh');
        return response.data;
    },

};