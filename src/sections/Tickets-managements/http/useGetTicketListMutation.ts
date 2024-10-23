import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllTickets}?search=${search}`);
  return data.data;
}

export const useGetTicketListMutation = (search) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.getAllTickets}?search=${search}`],
    queryFn: () => fetchData(search),
    // enabled: false,
  });
};
