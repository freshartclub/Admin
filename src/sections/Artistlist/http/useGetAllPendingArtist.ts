import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllPendingArtist}?s=${search}`);
  return data;
}

export const useGetPendingArtist = (search) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.getAllPendingArtist}/s=${search}`],
    queryFn: () => fetchData(search),
  });
};
