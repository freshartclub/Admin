import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const addTechnicMutation = () => {
  const navigate = useNavigate();

  async function AddTechnic(data) {
    return axiosInstance.post(`${ARTIST_ENDPOINTS.addTechnic}`, data);
  }

  return useMutation({
    mutationFn: AddTechnic,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.category.technic.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default addTechnicMutation;
