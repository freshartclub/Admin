import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { PICKLIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const useAddPicklist = () => {
  const navigate = useNavigate();

  async function addPicklist(data) {
    return axiosInstance.patch(PICKLIST_ENDPOINTS.addPicklist, data);
  }

  return useMutation({
    mutationFn: addPicklist,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.category.picklist.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddPicklist;
