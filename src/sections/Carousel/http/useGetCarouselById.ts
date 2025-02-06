import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS, GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return;
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getCarousel}/${id}`);
  return data.data;
}

export const useGetCarouselById = (id) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getCarousel, id],
    queryFn: () => fetchData(id),
  });
};
