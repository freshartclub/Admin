import { useQuery } from '@tanstack/react-query';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData() {
  const { data } = await axiosInstance.get(`${GENERAL_ENDPOINTS.getStyle}`);
  return data.data;
}

export const useGetStyleListMutation = () => {
  return useQuery({
    queryKey: ['styleList'],
    queryFn: fetchData,
  });
};
