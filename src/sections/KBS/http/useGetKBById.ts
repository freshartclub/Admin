import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return {};
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getKBById}/${id}`);
  return data.data;
}

export const useGetKBById = (id) => {
  return useQuery({
    queryKey: ['kb'],
    queryFn: () => fetchData(id),
  });
};
