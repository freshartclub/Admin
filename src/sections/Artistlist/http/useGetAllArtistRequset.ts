import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllBecomeArtist}?s=${search}`);
  return data.data;
}

export const useGetAllArtistRequest = (search) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.getAllBecomeArtist}?s=${search}`],
    queryFn: () => fetchData(search),
  });
};
