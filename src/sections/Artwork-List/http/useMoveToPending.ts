import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

export const useMoveToPending = (id) => {
  const queryClient = useQueryClient();
  async function movePending() {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.movePending}/${id}`);

    return response;
  }
  return useMutation({
    mutationFn: movePending,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getArtWorkList],
        refetchType: 'all',
      });

      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
