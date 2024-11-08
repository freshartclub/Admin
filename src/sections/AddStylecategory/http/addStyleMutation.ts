import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { GENERAL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const addStyleMutation = (id) => {
  const navigate = useNavigate();

  let url = `${GENERAL_ENDPOINTS.addStyle}`;
  if (id) url = `${GENERAL_ENDPOINTS.addStyle}?id=${id}`;

  async function AddStyle(data) {
    return axiosInstance.post(url, data);
  }

  return useMutation({
    mutationFn: AddStyle,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.category.style.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default addStyleMutation;
