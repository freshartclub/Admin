import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id: any) {
  if (!id) return;
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getArtistDetail}/${id}`);
  return data.data;
}

export const useGetExistingUserDetails = (id: any) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getArtistDetail],
    queryFn: () => fetchData(id),
  });
};
