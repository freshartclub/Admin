import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllCarousel}?s=${search}`);
  return data.data;
}

export const useGetAllCarousel = (search) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllCarousel, search],
    queryFn: () => fetchData(search),
  });
};
