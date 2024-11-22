import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getTicketDetail}/${id}`);
  return data.data;
}

export const useGetTicketDetailMutation = (id) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getTicketDetail, id],
    queryFn: () => fetchData(id),
  });
};
