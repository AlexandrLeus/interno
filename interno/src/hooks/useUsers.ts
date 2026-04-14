import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { userApi } from '../api/userApi';

export const useMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => userApi.getMe(),
    enabled: options?.enabled,
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          avatar: data,
        };
      });
    },
  });
};