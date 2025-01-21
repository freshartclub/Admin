import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useDeleteArtworkItem = (id, itemId) => {
  const queryClient = useQueryClient();
  async function deleteArtworkItem() {
    return axiosInstance.patch(`${ARTIST_ENDPOINTS.deleteHomeArtworkItem}/${id}/${itemId}`);
  }

  return useMutation({
    mutationFn: deleteArtworkItem,

    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getHomeArtwork],
        refetchType: 'all',
      });
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteArtworkItem;
