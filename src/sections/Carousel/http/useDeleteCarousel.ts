import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useDeleteCarousel = (id) => {
  const queryClient = useQueryClient();
  async function deleteCarousel() {
    return axiosInstance.patch(`${ARTIST_ENDPOINTS.deleteCarousel}/${id}`);
  }

  return useMutation({
    mutationFn: deleteCarousel,

    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getAllCarousel],
        refetchType: 'all',
      });
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteCarousel;
