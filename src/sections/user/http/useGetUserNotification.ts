import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

export const useGetUserNotification = (id: string, enabled: boolean) => {
  async function fetchData() {
    if (!id) return;
    const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getNotification}/${id}`);
    return data.data;
  }

  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getNotification, id],
    queryFn: fetchData,
    enabled: !!id && enabled,
  });
};
