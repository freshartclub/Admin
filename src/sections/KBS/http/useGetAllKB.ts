import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, grp) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllKB}?s=${search}&grp=${grp}`);
  return data.data;
}

export const useGetAllKB = (search, grp) => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllKB, search, grp],
    queryFn: () => fetchData(search, grp),
  });
};
