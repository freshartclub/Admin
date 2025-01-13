import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useRestoreCollection = (id) => {
  const queryClient = useQueryClient();
  async function restoreCollection() {
    return axiosInstance.patch(`${ARTIST_ENDPOINTS.restoreCollection}/${id}`);
  }

  return useMutation({
    mutationFn: restoreCollection,
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

export default useRestoreCollection;
