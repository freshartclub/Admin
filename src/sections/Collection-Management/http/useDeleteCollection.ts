import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useDeleteCollection = (id) => {
  const queryClient = useQueryClient();
  async function DeleteCollection() {
    return axiosInstance.patch(`${ARTIST_ENDPOINTS.deleteCollection}/${id}`);
  }

  return useMutation({
    mutationFn: DeleteCollection,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getAllCollection],
        refetchType: 'all',
      });
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteCollection;
