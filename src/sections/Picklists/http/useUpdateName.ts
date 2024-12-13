import { useMutation } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { PICKLIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

const useUpdatePicklistName = (id) => {
  async function updatePicklistName(data) {
    return axiosInstance.patch(`${PICKLIST_ENDPOINTS.updatePicklistName}/${id}`, data);
  }

  return useMutation({
    mutationFn: updatePicklistName,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useUpdatePicklistName;
