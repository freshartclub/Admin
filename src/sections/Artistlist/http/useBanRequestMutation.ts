import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

export const useBanRequestMutation = (setBanPopUp) => {
  const queryClient = useQueryClient();
  async function banRequest(id) {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.banRequest}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: banRequest,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getAllBecomeArtist],
        refetchType: 'all',
      });

      setBanPopUp(false);
      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
