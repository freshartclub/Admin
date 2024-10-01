import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

import { ARTIST_ENDPOINTS } from '../apiEndPoints/Artist';

const useAddArtistMutation = (handleOnSuccess) => {
  const [searchParam, setSearchParam] = useSearchParams();

  const id = searchParam.get('id');
  async function addArtist({ body }: { body: any }) {
    if (id) return axiosInstance.post(`${ARTIST_ENDPOINTS.AddArtist}/${id}`, body);
    return axiosInstance.post(`${ARTIST_ENDPOINTS.AddArtist}`, body);
  }
  return useMutation({
    mutationFn: addArtist,
    onSuccess: async (res, body) => {
      setSearchParam({ id: res.data.id });
      handleOnSuccess(body.body);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddArtistMutation;
