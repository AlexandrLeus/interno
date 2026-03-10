import type { Category } from '../types/index';
import apiClient  from './config';

export const categoryApi = {
    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get('/api/category')
        return response.data;
    }
}