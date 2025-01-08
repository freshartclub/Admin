import { useQuery } from '@tanstack/react-query';
import { ORDER_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData() {
  const { data } = await axiosInstance.get(ORDER_ENDPOINTS.getPurchaseOrder);
  return data.data;
}

export const useGetPurchaseOrder = () => {
  return useQuery({
    queryKey: [ORDER_ENDPOINTS.getPurchaseOrder],
    queryFn: fetchData,
  });
};
