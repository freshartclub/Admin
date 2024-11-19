import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { PICKLIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const useUpdatePicklist = (id, name) => {
  const navigate = useNavigate();

  async function updatePicklist(data) {
    return axiosInstance.patch(`${PICKLIST_ENDPOINTS.updatePicklist}/${id}?name=${name}`, data);
  }

  return useMutation({
    mutationFn: updatePicklist,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.category.picklist.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useUpdatePicklist;
