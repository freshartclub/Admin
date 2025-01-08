import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, date, status) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getAllArtistInDatabase}?s=${search}&date=${date}&status=${status}`
  );
  return data.data;
}

export const useGetArtistList = (search, date, status) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllArtistInDatabase, search, date, status],
    queryFn: () => fetchData(search, date, status),
  });
};
