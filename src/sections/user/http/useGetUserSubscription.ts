import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

export const useGetUserSubscription = (id: string, enabled: boolean) => {
  async function fetchData() {
    const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getSubscriptions}/${id}`);
    return data.data;
  }

  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getSubscriptions, id],
    queryFn: fetchData,
    enabled: !!id && enabled,
  });
};
