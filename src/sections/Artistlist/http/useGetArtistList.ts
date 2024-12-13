import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, date) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getAllArtistInDatabase}?s=${search}&date=${date}`
  );
  return data;
}

export const useGetArtistList = (search, date) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllArtistInDatabase, search, date],
    queryFn: () => fetchData(search, date),
  });
};
