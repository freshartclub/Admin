import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

import { AUTH_ENDPOINTS } from '../apiEndPoints/Auth';

async function createArtist({ body, id }: { body: any; id: string }) {
  if (id) return axiosInstance.post(`${AUTH_ENDPOINTS.SignIn}/${id}`, body);
  return axiosInstance.post(`${AUTH_ENDPOINTS.SignIn}`, body);
}
const useAddArtistMutation = (handleOnSuccess) =>
  useMutation({
    mutationFn: createArtist,
    onSuccess: async (res, body) => {
      handleOnSuccess(res, body);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });

export default useAddArtistMutation;
