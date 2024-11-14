import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function deleteInsignia(id) {
  const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.deleteInsignia}/${id}`);
  return response;
}
const useDeleteInsignia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInsignia,
    onSuccess: async (res) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getAllInsignia],
        refetchType: 'all',
      });

      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteInsignia;
