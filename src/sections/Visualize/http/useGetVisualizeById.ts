import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

export const useGetVisualizeById = (id: string) => {
  async function fetchData() {
    const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getVisualizeById}/${id}`);
    return data.data;
  }

  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getVisualizeById, id],
    refetchOnWindowFocus: false,
    enabled: !!id,
    queryFn: fetchData,
  });
};
