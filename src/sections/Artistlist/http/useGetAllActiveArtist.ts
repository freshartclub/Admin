import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, currPage, cursor, direction, limit) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getAllArtist}?s=${search}&currPage=${currPage}&cursor=${cursor}&direction=${direction}&limit=${limit}`
  );
  return data;
}

export const useGetAllActiveArtist = (search, currPage, cursor, direction, limit) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllArtist, search, currPage, cursor, direction, limit],
    queryFn: () => fetchData(search, currPage, cursor, direction, limit),
  });
};
