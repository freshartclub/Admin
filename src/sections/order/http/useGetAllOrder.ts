import { useQuery } from '@tanstack/react-query';
import { ORDER_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, currPage, cursor, direction, limit) {
  const { data } = await axiosInstance.get(
    `${ORDER_ENDPOINTS.getAllOrders}?s=${search}&currPage=${currPage}&cursor=${cursor}&direction=${direction}&limit=${limit}`
  );
  return data;
}

export const useGetAllOrders = (search, currPage, cursor, direction, limit) => {
  return useQuery({
    queryKey: [ORDER_ENDPOINTS.getAllOrders, search, currPage, cursor, direction, limit],
    queryFn: () => fetchData(search, currPage, cursor, direction, limit),
  });
};
