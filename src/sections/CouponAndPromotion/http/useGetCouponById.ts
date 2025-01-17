import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return {};
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getCouponById}/${id}`);
  return data.data;
}

export const useGetCouponById = (id) => {
  return useQuery({
    queryKey: ['coupon', id],
    queryFn: () => fetchData(id),
  });
};
