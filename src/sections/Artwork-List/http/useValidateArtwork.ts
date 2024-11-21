import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

export const useValidateartWork = (id) => {
  const queryClient = useQueryClient();
  async function validateArtWork() {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.validateArtwork}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: validateArtWork,
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
