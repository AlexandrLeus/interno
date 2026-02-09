import type { Tag } from '../types/index';
import { apiClient } from './config';

export const tagApi = {
    async getTags(): Promise<Tag[]> {
        const response = await apiClient.get('/api/tag')
        return response.data;
    }
}