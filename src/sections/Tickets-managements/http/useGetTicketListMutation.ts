import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, status, days, filter, filterOption) {
  const { data } = await axiosInstance.get(
    `${ARTIST_ENDPOINTS.getAllTickets}?search=${search}&status=${status}&days=${days}&filterType=${filter}&filterOption=${filterOption}`
  );
  return data.data;
}

export const useGetTicketListMutation = (search, status, days, filter, filterOption) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllTickets, search, status, days, filter, filterOption],
    queryFn: () => fetchData(search, status, days, filter, filterOption),
  });
};
