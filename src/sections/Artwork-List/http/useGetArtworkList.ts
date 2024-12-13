import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, sStatus, days) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getArtWorkList}?s=${search}&status=${sStatus}&days=${days}`
  );
  return data;
}

export const useGetArtworkList = (search, sStatus, days) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getArtWorkList, search, sStatus, days],
    queryFn: () => fetchData(search, sStatus, days),
  });
};
