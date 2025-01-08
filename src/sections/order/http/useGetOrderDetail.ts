import { useQuery } from '@tanstack/react-query';
import { ORDER_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useParams, useSearchParams } from 'src/routes/hooks';
import axiosInstance from 'src/utils/axios';

async function fetchData(id, orderType) {
  if (!id) return {};
  const { data } = await axiosInstance.get(
    `${ORDER_ENDPOINTS.getOrderDetail}/${id}?orderType=${orderType}`
  );
  return data.data;
}

export const useGetOrderDetail = () => {
  const id = useParams().id;
  const orderType = useSearchParams().get('orderType');

  return useQuery({
    queryKey: [ORDER_ENDPOINTS.getOrderDetail, id],
    queryFn: () => fetchData(id, orderType),
  });
};
