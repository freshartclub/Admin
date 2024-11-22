import { useQuery } from '@tanstack/react-query';
import { ORDER_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData() {
  const { data } = await axiosInstance.get(ORDER_ENDPOINTS.getSubscriptionOrder);
  return data;
}

export const useGetSubscriptionOrder = () => {
  return useQuery({
    queryKey: [ORDER_ENDPOINTS.getSubscriptionOrder],
    queryFn: fetchData,
  });
};
