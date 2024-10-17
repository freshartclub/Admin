import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(input) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getArtistById}?artistId=${input}`);
  return data.data;
}

export const useGetArtistById = (input) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.getArtistById}?artistId=${input}`],
    queryFn: () => fetchData(input),
    enabled: false,
  });
};
