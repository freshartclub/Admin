import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id: any) {
  if (!id) return {};
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getHomeArtworkById}/${id}`);
  return data.data;
}

export const useGetHomeArtworkById = (id) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getHomeArtworkById, id],
    queryFn: () => fetchData(id),
  });
};
