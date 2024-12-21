import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useDeleteArtworkColl = (id) => {
  const queryClient = useQueryClient();
  async function DeleteArtworkCollection(data) {
    return axiosInstance.patch(`${ARTIST_ENDPOINTS.deleteArtworkFromCollection}/${id}`, data);
  }

  return useMutation({
    mutationFn: DeleteArtworkCollection,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getCollectionById],
        refetchType: 'all',
      });
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteArtworkColl;
