import { useQuery } from '@tanstack/react-query';
import { ORDER_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData() {
  const { data } = await axiosInstance.get(ORDER_ENDPOINTS.getAllOrders);
  return data.data;
}

export const useGetAllOrders = () => {
  return useQuery({
    queryKey: [ORDER_ENDPOINTS.getAllOrders],
    queryFn: fetchData,
  });
};
