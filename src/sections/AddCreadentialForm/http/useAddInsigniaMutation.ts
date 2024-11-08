import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const useAddInsigniaMutation = (id) => {
  const navigate = useNavigate();

  let url = `${ARTIST_ENDPOINTS.addInsignia}`;
  if (id) url = `${ARTIST_ENDPOINTS.addInsignia}?id=${id}`;

  async function AddInsignia(data) {
    return axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: AddInsignia,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.creadentialsAndInsigniasArea.list);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddInsigniaMutation;
