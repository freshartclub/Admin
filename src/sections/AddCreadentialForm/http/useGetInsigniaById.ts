import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return {};
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getInsigniaById}/${id}`);
  return data;
}

export const useGetInsigniaById = (id) => {
  return useQuery({
    queryKey: ['InsigniaList'],
    queryFn: () => fetchData(id),
  });
};
