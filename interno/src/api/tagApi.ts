import type { Tag } from '../types/index';
import {publicClient}  from './config';

export const tagApi = {
    async getTags(): Promise<Tag[]> {
        const response = await publicClient.get('/api/tag')
        return response.data;
    }
}