import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, status) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getAllBecomeArtist}?s=${search}&status=${status}`
  );
  return data.data;
}

export const useGetAllArtistRequest = (search, status) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllBecomeArtist, search, status],
    queryFn: () => fetchData(search, status),
  });
};
