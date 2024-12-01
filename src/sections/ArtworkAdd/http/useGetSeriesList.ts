import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return [];
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getSeriesList}/${id}`);
  return data.data;
}

export const useGetSeriesList = (id) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getSeriesList, id],
    queryFn: () => fetchData(id),
    enabled: true,
  });
};
