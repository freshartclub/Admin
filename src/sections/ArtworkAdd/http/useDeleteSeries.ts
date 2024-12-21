import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function deleteSeries(data) {
  return axiosInstance.patch(`${ARTIST_ENDPOINTS.deleteSeries}/${data.id}`, data);
}

const useDeleteSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSeries,

    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getSeriesList],
        refetchType: 'all',
      });
      toast.success(res.data.message);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeleteSeries;
