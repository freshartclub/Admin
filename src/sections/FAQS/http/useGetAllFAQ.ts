import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllFAQ}?s=${search}`);
  return data.data;
}

export const useGetAllFAQ = (search) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllFAQ, search],
    queryFn: () => fetchData(search),
  });
};
