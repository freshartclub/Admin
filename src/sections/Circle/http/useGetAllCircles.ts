import { useQuery } from '@tanstack/react-query';
import { CIRCLE_ENDPOINTS, GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${CIRCLE_ENDPOINTS.allCircles}?s=${search}`);
  return data.data;
}

export const useGetAllCircles = (search) => {
  return useQuery({
    queryKey: [CIRCLE_ENDPOINTS.allCircles, search],
    queryFn: () => fetchData(search),
  });
};
