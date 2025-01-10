import { useQuery } from '@tanstack/react-query';
import { ORDER_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ORDER_ENDPOINTS.getAllOrders}?s=${search}`);
  return data.data;
}

export const useGetAllOrders = (search) => {
  return useQuery({
    queryKey: [ORDER_ENDPOINTS.getAllOrders, search],
    queryFn: () => fetchData(search),
  });
};
