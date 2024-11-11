import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return {};
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getCatalogById}/${id}`);
  return data;
}

export const useGetCatalogById = (id) => {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: () => fetchData(id),
  });
};
