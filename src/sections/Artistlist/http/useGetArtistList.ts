import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, date, status, currPage, cursor, direction, limit) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getAllArtistInDatabase}?s=${search}&date=${date}&status=${status}&currPage=${currPage}&cursor=${cursor}&direction=${direction}&limit=${limit}`
  );
  return data;
}

export const useGetArtistList = (search, date, status, currPage, cursor, direction, limit) => {
  return useQuery({
    queryKey: [
      ARTIST_ENDPOINTS.getAllArtistInDatabase,
      search,
      date,
      status,
      currPage,
      cursor,
      direction,
      limit,
    ],
    queryFn: () => fetchData(search, date, status, currPage, cursor, direction, limit),
  });
};
