import { useQuery } from '@tanstack/react-query';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${GENERAL_ENDPOINTS.getMedia}?s=${search}`);
  return data.data;
}

export const useGetMediaListMutation = (search) => {
  return useQuery({
    queryKey: [GENERAL_ENDPOINTS.getMedia, search],
    queryFn: () => fetchData(search),
  });
};
