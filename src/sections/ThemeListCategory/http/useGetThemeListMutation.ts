import { useQuery } from '@tanstack/react-query';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${GENERAL_ENDPOINTS.getTheme}?s=${search}`);
  return data.data;
}

export const useGetThemeListMutation = (search) => {
  return useQuery({
    queryKey: [`${GENERAL_ENDPOINTS.getTheme}?s=${search}`],
    queryFn: () => fetchData(search),
  });
};
