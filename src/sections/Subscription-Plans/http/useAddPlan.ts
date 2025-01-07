import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const useAddPlan = (id) => {
  const navigate = useNavigate();

  let url = `${ARTIST_ENDPOINTS.addPlan}`;
  if (id) url = `${ARTIST_ENDPOINTS.addPlan}/${id}`;

  async function addPlan(data) {
    return axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: addPlan,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.subscriptionplan.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddPlan;
