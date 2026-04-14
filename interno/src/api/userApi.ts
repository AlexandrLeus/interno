import type { User } from '../types/index';
import { privateClient } from './config';

export const userApi = {

    async getMe(): Promise<User> {
        const response = await privateClient.get('/api/user/me');
        return response.data;
    },

    async uploadAvatar(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await privateClient.post('/api/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};