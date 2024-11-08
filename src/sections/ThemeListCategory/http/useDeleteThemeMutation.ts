import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useDeleteThemeMutation = () => {
  const queryClient = useQueryClient();

  async function deleteTheme(id) {
    const response = await axiosInstance.patch(`${GENERAL_ENDPOINTS.deleteTheme}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: deleteTheme,
    onSuccess: async (res) => {
      queryClient.invalidateQueries({
        queryKey: [GENERAL_ENDPOINTS.getDiscipline],
        refetchType: 'all',
      });

      // Display success message
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteThemeMutation;
