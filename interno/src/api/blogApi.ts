import type {BlogPost, PaginatedResponse, BlogPosts, SearchBlogPost} from '../types/index';
import apiClient from './config';

export const blogApi = {
  async getAll(page: number, pageSize: number, tag?: number[], category?: number[]): Promise<PaginatedResponse<BlogPosts>> {
    const params: Record<string, any> = {
      page,
      pageSize
    };

    if (tag && tag.length > 0) {
      params.tag = tag.join(',');
    }
    if (category && category.length > 0) {
      params.tag = category.join(',');
    }

    const response = await apiClient.get('/api/blog', { params });
    return response.data;
  },

  async search(page: number, pageSize: number, q: string): Promise<PaginatedResponse<SearchBlogPost>> {
    const response = await apiClient.get('/api/blog/search', {
      params: {
        page, pageSize, q
      }
    });
    return response.data;
  },

  async getById(id: number): Promise<BlogPost> {
    const response = await apiClient.get(`/api/blog/${id}`);
    return response.data;
  },

  async create(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const response = await apiClient.post('/api/blog', post);
    return response.data;
  },

  async update(id: number, post: Partial<BlogPost>): Promise<void> {
    await apiClient.put(`/api/blog/${id}`, post);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/blog/${id}`);
  },

};