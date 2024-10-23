import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

export const useUnsuspendArtistMutation = (id) => {
  const queryClient = useQueryClient();
  async function UnSuspendArtist() {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.unSuspendArtist}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: UnSuspendArtist,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.suspendedArtist],
        refetchType:"all"
      });

      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
