import { useQuery } from '@tanstack/react-query';
import { CIRCLE_ENDPOINTS, GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

export const useGetAllCircles = ({ search, sort }) => {
  async function fetchData() {
    const { data } = await axiosInstance.get(
      `${CIRCLE_ENDPOINTS.allCircles}?s=${search}&sortType=${sort}`
    );
    return data.data;
  }

  return useQuery({
    queryKey: [CIRCLE_ENDPOINTS.allCircles, search, sort],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
  });
};
