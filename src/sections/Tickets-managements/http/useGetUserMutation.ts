import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(input) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getUserByQueryInput}?s=${input}`);
  return data.data;
}

export const useGetUesrByQueryInput = (input) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.getUserByQueryInput}?s=${input}`],
    queryFn: () => fetchData(input),
    enabled: false,
  });
};
