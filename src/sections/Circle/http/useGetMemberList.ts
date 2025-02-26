import { useQuery } from '@tanstack/react-query';
import { CIRCLE_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

export const useGetMemeberList = (id) => {
  async function fetchData() {
    const { data } = await axiosInstance.get(`${CIRCLE_ENDPOINTS.getMembers}/${id}`);
    return data.data;
  }

  return useQuery({
    queryKey: [CIRCLE_ENDPOINTS.getMembers, id],
    queryFn: fetchData,
    enabled: !!id,
  });
};
