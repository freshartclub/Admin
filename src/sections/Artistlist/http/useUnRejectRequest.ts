import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

export const useUnRejectRequest = (setUnRejectPopUp) => {
  const queryClient = useQueryClient();
  async function unRejectRequest(id) {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.unRejectRequest}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: unRejectRequest,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getAllBecomeArtist],
        refetchType: 'all',
      });
      setUnRejectPopUp(false);
      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
