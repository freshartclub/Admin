import { useQuery } from '@tanstack/react-query';
import { EMAIL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${EMAIL_ENDPOINTS.getEmail}?s=${search}`);
  return data.data;
}

export const useGetAllEmailType = (search) => {
  return useQuery({
    queryKey: [EMAIL_ENDPOINTS.getEmail, search],
    queryFn: () => fetchData(search),
  });
};
