import { useQuery } from '@tanstack/react-query';
import { EMAIL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return {};
  const { data } = await axiosInstance.get(`${EMAIL_ENDPOINTS.getEmailById}/${id}`);
  return data.data;
}

export const useGetEmailById = (id) => {
  return useQuery({
    queryKey: [EMAIL_ENDPOINTS.getEmailById, id],
    queryFn: () => fetchData(id),
  });
};
