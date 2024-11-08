import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const addTechnicMutation = (id) => {
  const navigate = useNavigate();

  let url = `${GENERAL_ENDPOINTS.addTechnic}`;
  if (id) url = `${GENERAL_ENDPOINTS.addTechnic}?id=${id}`;

  async function AddTechnic(data) {
    return axiosInstance.post(url, data);
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
