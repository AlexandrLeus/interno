import type { Category } from '../types/index';
import {publicClient}  from './config';

export const categoryApi = {
    async getCategories(): Promise<Category[]> {
        const response = await publicClient.get('/api/category')
        return response.data;
    }
}