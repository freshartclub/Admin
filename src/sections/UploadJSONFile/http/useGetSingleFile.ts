import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(file) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getFile}?file=${file}`);
  return data;
}

export const useGetSingleFile = (file) => {
  return useQuery({
    queryFn: () => fetchData(file),
    queryKey: [ARTIST_ENDPOINTS.getFile],
  });
};
