import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const addMediaMutation = () => {
  const navigate = useNavigate();

  async function AddMedia(data) {
    return axiosInstance.post(`${ARTIST_ENDPOINTS.addMedia}`, data);
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
