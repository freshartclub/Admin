import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllCoupon}?s=${search}`);
  return data.data;
}

export const useGetCouponList = (search) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllCoupon, search],
    queryFn: () => fetchData(search),
  });
};
