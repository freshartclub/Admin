import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useDeleteCatalog = (id) => {
  const queryClient = useQueryClient();

  async function DeleteCatalog() {
    return axiosInstance.patch(`${ARTIST_ENDPOINTS.deleteCatalog}/${id}`);
  }

  return useMutation({
    mutationFn: DeleteCatalog,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getAllCatalog],
        refetchType: 'all',
      });
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteCatalog;
