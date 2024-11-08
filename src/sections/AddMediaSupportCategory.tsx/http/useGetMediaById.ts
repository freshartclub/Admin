import { useQuery } from '@tanstack/react-query';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return {};
  const { data } = await axiosInstance.get(`${GENERAL_ENDPOINTS.getMediaById}/${id}`);
  return data.data;
}

export const useGetMediaById = (id) => {
  return useQuery({
    queryKey: ['MediaList'],
    queryFn: () => fetchData(id),
  });
};
