import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import axiosInstance from 'src/utils/axios';

import { ARTIST_ENDPOINTS } from '../apiEndPoints/Artist';

async function getArtistDetail(id) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getArtistDetail}/${id}`);
  return data.data;
}

const useGetArtist = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const id = searchParam.get('id');
  const fetchUser = async () => {
    try {
      const res = await getArtistDetail(id);

      return res;
    } catch (error) {
      return error;
    }
  };

  console.log(fetchUser)
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getArtistDetail],
    queryFn: fetchUser,
    enabled: false,
  });
};

export default useGetArtist;
