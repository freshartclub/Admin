import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

export const useRejectRequestMutation = (setRejectPopUp) => {
  const queryClient = useQueryClient();
  async function rejectRequest(id) {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.rejectRequest}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: rejectRequest,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getAllBecomeArtist],
        refetchType: 'all',
      });
      setRejectPopUp(false);
      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
