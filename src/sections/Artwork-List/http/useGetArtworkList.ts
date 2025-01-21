import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, sStatus, days, currPage, cursor, direction, limit) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getArtWorkList}?s=${search}&status=${sStatus}&days=${days}&currPage=${currPage}&cursor=${cursor}&direction=${direction}&limit=${limit}`
  );
  return data;
}

export const useGetArtworkList = (search, sStatus, days, currPage, cursor, direction, limit) => {
  return useQuery({
    queryKey: [
      ARTIST_ENDPOINTS.getArtWorkList,
      search,
      sStatus,
      days,
      currPage,
      cursor,
      direction,
      limit,
    ],
    queryFn: () => fetchData(search, sStatus, days, currPage, cursor, direction, limit),
  });
};
