import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllKB}?s=${search}`);
  return data.data;
}

export const useGetAllKB = (search) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllKB, search],
    queryFn: () => fetchData(search),
  });
};
