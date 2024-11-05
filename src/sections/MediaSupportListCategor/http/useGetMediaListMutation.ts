import { useQuery } from '@tanstack/react-query';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData() {
  const { data } = await axiosInstance.get(`${GENERAL_ENDPOINTS.getMedia}`);
  return data.data;
}

export const useGetMediaListMutation = () => {
  return useQuery({
    queryKey: ['mediaList'],
    queryFn: fetchData,
  });
};
