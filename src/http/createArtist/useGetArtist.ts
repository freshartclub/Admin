import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { ARTIST_ENDPOINTS } from '../apiEndPoints/Artist';
import { useSearchParams } from 'src/routes/hooks';

async function getArtistDetail(id) {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getArtistDetail}/${id}`);
  return data.data;
}

const useGetArtist = () => {
  const id = useSearchParams().get('id');
  const fetchUser = async () => {
    try {
      const res = await getArtistDetail(id);
      return res;
    } catch (error) {
      return error;
    }
  };

  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getArtistDetail],
    queryFn: fetchUser,
    enabled: false,
  });
};

export default useGetArtist;
