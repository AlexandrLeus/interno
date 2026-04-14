import { useQuery, keepPreviousData} from '@tanstack/react-query';
import { tagApi } from '../api/tagApi';

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagApi.getTags(),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
};