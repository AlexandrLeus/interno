import type { User } from '../types/index';
import {privateClient} from './config';

export const authApi = {

    async getMe(): Promise<User> {
        const response = await privateClient.get('/api/auth/me');
        return response.data;
    },
};