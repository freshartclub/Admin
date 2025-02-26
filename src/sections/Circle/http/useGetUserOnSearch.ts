import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getUserOnSearch}?s=${search}`);
  return data.data;
}

export const useGetUserOnSearch = (search) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getUserOnSearch, search],
    queryFn: () => fetchData(search),
    enabled: !!search,
  });
};
