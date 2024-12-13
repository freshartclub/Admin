import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  if (search === '') return [];
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getSearchedArtwork}?s=${search}`);
  return data;
}

export const useGetSearchedArtworks = (search) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getSearchedArtwork, search],
    queryFn: () => fetchData(search),
    enabled: true,
  });
};
