import type { BlogPost, PaginatedResponse, BlogPosts, SearchBlogPost, CreatePostCredentials } from '../types/index';
import {publicClient, privateClient} from './config';

export const blogApi = {
  async getAll(page: number, pageSize: number, tag?: number[], category?: number[], author?: string): Promise<PaginatedResponse<BlogPosts>> {
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

    if (author) {
      params.author = author;
    }

    const response = await publicClient.get('/api/blog', { params });
    return response.data;
  },

  async search(page: number, pageSize: number, q: string): Promise<PaginatedResponse<SearchBlogPost>> {
    const response = await publicClient.get('/api/blog/search', {
      params: {
        page, pageSize, q
      }
    });
    return response.data;
  },

  async getById(id: number): Promise<BlogPost> {
    const response = await publicClient.get(`/api/blog/${id}`);
    return response.data;
  },

  async create(post: CreatePostCredentials): Promise<BlogPost> {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('description', post.description);
    formData.append('content', post.content);
    post.tagIds.forEach(id => formData.append('tagIds', id.toString()));
    post.categoryIds.forEach(id => formData.append('categoryIds', id.toString()));

    if (post.image) {
      formData.append('image', post.image);
    }
    const response = await privateClient.post('/api/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async update(id: number, post: Partial<BlogPost>): Promise<void> {
    await privateClient.put(`/api/blog/${id}`, post);
  },

  async delete(id: number): Promise<void> {
    await privateClient.delete(`/api/blog/${id}`);
  },

};