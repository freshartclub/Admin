import { useQuery } from '@tanstack/react-query';
import { CIRCLE_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return;
  const { data } = await axiosInstance.get(`${CIRCLE_ENDPOINTS.getCircle}/${id}`);
  return data.data;
}

export const useGetCircleById = (id) => {
  return useQuery({
    queryKey: [CIRCLE_ENDPOINTS.getCircle, id],
    queryFn: () => fetchData(id),
  });
};
