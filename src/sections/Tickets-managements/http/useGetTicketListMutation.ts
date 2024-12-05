import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, status, days) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getAllTickets}?search=${search}&status=${status}&days=${days}`
  );
  return data;
}

export const useGetTicketListMutation = (search, status, days) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.getAllTickets}?search=${search}&status=${status}&days=${days}`],
    queryFn: () => fetchData(search, status, days),
  });
};
