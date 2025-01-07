import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData() {
  const { data } = await axiosInstance.get(ARTIST_ENDPOINTS.getAllPlan);
  return data;
}

export const useGetAllPlans = () => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllPlan],
    queryFn: fetchData,
  });
};
