import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getAllArtistInDatabase}?s=${search}`
  );
  return data.data;
}

export const useGetArtistList = (search) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.getAllArtistInDatabase}?s=${search}`],
    queryFn: () => fetchData(search),
  });
};
