import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

export const useRemoveArtWorkList = (id) => {
  const queryClient = useQueryClient();
  async function removeArtWork() {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.removeArtWorkList}/${id}`);

    return response;
  }
  return useMutation({
    mutationFn: removeArtWork,
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
