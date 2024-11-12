import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(search, grp) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllFAQ}?s=${search}&grp=${grp}`);
  return data;
}

export const useGetAllFAQ = (search, grp) => {
  return useQuery({
    queryKey: [`${ARTIST_ENDPOINTS.getAllFAQ}?s=${search}&grp=${grp}`],
    queryFn: () => fetchData(search, grp),
  });
};
