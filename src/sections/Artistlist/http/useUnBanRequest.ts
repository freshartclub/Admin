import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

export const useUnBanRequest = (setUnBanPopUp) => {
  const queryClient = useQueryClient();
  async function unBanRequest(id) {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.unBanRequest}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: unBanRequest,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getAllBecomeArtist],
        refetchType: 'all',
      });
      setUnBanPopUp(false);
      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
