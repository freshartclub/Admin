import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id: any) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getReviewArtwork}/${id}`);
  return data;
}

export const useGetReviewArtwork = (id: any) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getReviewArtwork],
    queryFn: () => fetchData(id),
  });
};
