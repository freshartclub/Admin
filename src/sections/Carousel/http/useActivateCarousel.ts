import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useActivateCarousel = (id) => {
  const queryClient = useQueryClient();
  async function activateCarousel() {
    return axiosInstance.patch(`${ARTIST_ENDPOINTS.activateCarousel}/${id}`);
  }

  return useMutation({
    mutationFn: activateCarousel,

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

export default useActivateCarousel;
