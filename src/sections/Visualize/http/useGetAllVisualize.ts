import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

export const useGetAllVisualize = (search: string, grp: string) => {
  async function fetchData() {
    const { data } = await axiosInstance.get(
      `${ARTIST_ENDPOINTS.getAllVisualize}?s=${search}&grp=${grp}`
    );
    return data.data;
  }

  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllVisualize, search, grp],
    refetchOnWindowFocus: false,
    queryFn: fetchData,
  });
};
