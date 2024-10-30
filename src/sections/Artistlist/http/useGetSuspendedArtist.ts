import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.suspendedArtist}?s=${search}`);
  return data.data;
}

export const useGetSuspendedArtistList = (search) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.suspendedArtist}?s=${search}`],
    queryFn: () => fetchData(search),
  });
};
