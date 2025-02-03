import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

// User id mogodb
export const useChnagePassword = (setShowPasswordPop: any) => {
  async function chnagePassword(input: any) {
    const response = await axiosInstance.patch(
      `${ARTIST_ENDPOINTS.chnageArtistPasswoed}/${input.id}`,
      input.data
    );

    return response;
  }
  
  return useMutation({
    mutationFn: chnagePassword,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      setShowPasswordPop(false);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
