import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { CIRCLE_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useDeleteCircle = (id: string) => {
  const queryClient = useQueryClient();
  if (!id) return toast.error('Circle id not found');

  async function deleteCircle() {
    return axiosInstance.patch(`${CIRCLE_ENDPOINTS.deleteCircle}/${id}`);
  }

  return useMutation({
    mutationFn: deleteCircle,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [CIRCLE_ENDPOINTS.allCircles],
        refetchType: 'all',
      });
      toast.success(res.data.message);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteCircle;
