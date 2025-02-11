import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS, CIRCLE_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  if (!search) return;
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getUserOnSearch}?s=${search}`);
  return data.data;
}

export const useGetUserOnSearch = (search) => {
  return useQuery({
    queryKey: ['user-on-search', search],
    queryFn: () => fetchData(search),
  });
};
