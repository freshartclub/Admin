import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS, EMAIL_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const useAddEmailType = (id) => {
  const navigate = useNavigate();

  let url = `${EMAIL_ENDPOINTS.addEmail}`;
  if (id) url = `${EMAIL_ENDPOINTS.addEmail}/${id}`;

  async function AddEmailType(data) {
    return axiosInstance.post(url, data);
  }

  return useMutation({
    mutationFn: AddEmailType,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.category.email.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddEmailType;
