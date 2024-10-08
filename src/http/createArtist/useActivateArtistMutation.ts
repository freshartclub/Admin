import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';

import { ARTIST_ENDPOINTS } from '../apiEndPoints/Artist';

const useActivateArtistMutation = (handleOnActivataion) => {
  const [searchParam, setSearchParam] = useSearchParams();

  const id = searchParam.get('id');
  async function activateArtist() {
    if (id) return axiosInstance.post(`${ARTIST_ENDPOINTS.activateArtist}/${id}`);
  }
  return useMutation({
    mutationFn: activateArtist,
    onSuccess: async (res, body) => {
      toast.success(res?.data.message);
      handleOnActivataion();
    },

    onError: (res) => {
   
      toast.error(res.response.data.message);
    },
  });
};

export default useActivateArtistMutation;
