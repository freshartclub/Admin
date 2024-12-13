import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id) {
  if (!id) return {};
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getIncidentById}/${id}`);
  return data.data;
}

export const useGetIncidentById = (id) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getIncidentById, id],
    queryFn: () => fetchData(id),
  });
};
