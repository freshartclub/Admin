import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const useAddKBMutation = (id) => {
  const navigate = useNavigate();

  let url = `${ARTIST_ENDPOINTS.addKB}`;
  if (id) url = `${ARTIST_ENDPOINTS.addKB}?id=${id}`;

  async function AddKB(data) {
    return axiosInstance.post(url, data);
  }

  return useMutation({
    mutationFn: AddKB,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.kbdatabase.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddKBMutation;
