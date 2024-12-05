import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { PICKLIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useDeletePicklist = (id, name) => {
  const queryClient = useQueryClient();
  async function deletePicklist() {
    return axiosInstance.patch(`${PICKLIST_ENDPOINTS.deletePicklist}/${id}?name=${name}`);
  }

  return useMutation({
    mutationFn: deletePicklist,

    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [PICKLIST_ENDPOINTS.getPicklists],
        refetchType: 'all',
      });
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useDeletePicklist;
