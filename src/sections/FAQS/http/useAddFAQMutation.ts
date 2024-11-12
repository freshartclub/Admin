import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const useAddFAQMutation = (id) => {
  const navigate = useNavigate();

  let url = `${ARTIST_ENDPOINTS.addFAQ}`;
  if (id) url = `${ARTIST_ENDPOINTS.addFAQ}?id=${id}`;

  async function AddFAQ(data) {
    return axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: AddFAQ,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.faq.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddFAQMutation;
