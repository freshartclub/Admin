import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getTicketReply}/${id}`);
  return data.data;
}

export const useGetReplyMutation = (id) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.getTicketReply}/${id}`],
    queryFn: () => fetchData(id),
    // enabled: false,
  });
};
