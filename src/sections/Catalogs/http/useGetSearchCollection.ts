import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  if (search === '') return [];
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getSearchedCollection}?s=${search}`);
  return data.data;
}

export const useGetSearchCollection = (search) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getSearchedCollection, search],
    queryFn: () => fetchData(search),
    enabled: true,
  });
};
