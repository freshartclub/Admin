import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return {};
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getArtworkById}/${id}`);
  return data.data;
}

export const useGetArtworkById = (id) => {
  return useQuery({
    queryKey: ['Artwork'],
    queryFn: () => fetchData(id),
  });
};
