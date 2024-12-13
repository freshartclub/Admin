import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(input) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getUserByQueryInput}?s=${input}`);
  return data;
}

export const useGetUesrByQueryInput = (input) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getUserByQueryInput, input],
    queryFn: () => fetchData(input),
    enabled: true,
  });
};
