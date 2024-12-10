import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

export const useSuspendArtistMutation = () => {
  const queryClient = useQueryClient();

  async function CreateArtist(id) {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.suspendArtist}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: CreateArtist,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getAllPendingArtist],
        refetchType: 'all',
      });

      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
