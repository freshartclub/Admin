import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { CIRCLE_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const useAddCircle = (id) => {
  const navigate = useNavigate();

  let url = CIRCLE_ENDPOINTS.addCircle;
  if (id) url = `${CIRCLE_ENDPOINTS.addCircle}/${id}`;

  async function addCircle(data) {
    return axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: addCircle,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.circle.list);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddCircle;
