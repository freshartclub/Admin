import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useDeleteMediaMutation = () => {
  const queryClient = useQueryClient();

  async function deleteMedia(id) {
    const response = await axiosInstance.patch(`${GENERAL_ENDPOINTS.deleteMedia}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: async (res) => {
      queryClient.invalidateQueries({
        queryKey: [GENERAL_ENDPOINTS.getDiscipline],
        refetchType: 'all',
      });
      
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteMediaMutation;
