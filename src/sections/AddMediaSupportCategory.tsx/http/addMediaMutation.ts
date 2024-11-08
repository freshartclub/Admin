import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const addMediaMutation = (id) => {
  const navigate = useNavigate();

  let url = `${GENERAL_ENDPOINTS.addMedia}`;
  if (id) url = `${GENERAL_ENDPOINTS.addMedia}?id=${id}`;

  async function AddMedia(data) {
    return axiosInstance.post(url, data);
  }

  return useMutation({
    mutationFn: AddMedia,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.category.mediasupport.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default addMediaMutation;
