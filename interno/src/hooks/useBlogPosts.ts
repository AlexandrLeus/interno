import { useQuery, keepPreviousData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../api/blogApi';
import { tagApi } from '../api/tagApi';
import type { PaginatedResponse, BlogPosts, SearchBlogPost, BlogPostsParams } from '../types/index';

export const useBlogPosts = ({ page, pageSize,  tag, category, author }: BlogPostsParams) => {
  return useQuery<PaginatedResponse<BlogPosts>>({
    queryKey: ['blog-posts', page, pageSize, tag, category, author],
    queryFn: () => blogApi.getAll(page, pageSize, tag, category, author),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
};

export const useBlogPost = (id: number) => {
  return useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => blogApi.getById(id),
    enabled: !!id,
    staleTime: 1000*60,
  });
};

export const useSearch = (searchTerm: string, pageSize = 5) =>
  useInfiniteQuery({
    queryKey: ['blogSearch', searchTerm],
    initialPageParam: 1,

    queryFn: ({ pageParam = 1 }) =>
      blogApi.search(pageParam, pageSize, searchTerm),

    enabled: searchTerm.length >= 2,

    getNextPageParam: (lastPage: PaginatedResponse<SearchBlogPost>) =>
      lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined,
  });

  export const useBlogDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => blogApi.delete(postId),
    
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.removeQueries({ queryKey: ['blogPost', postId] });
      
      console.log('Post deleted successfully');
    },
    
    onError: (error: any) => {
      console.error('Delete failed:', error.response?.data?.message || error.message);
    },
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagApi.getTags(),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
};
