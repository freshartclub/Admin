import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const useAddVisualize = (id: string) => {
  const navigate = useNavigate();

  let url = `${ARTIST_ENDPOINTS.addVisualizer}`;
  if (id) url = `${ARTIST_ENDPOINTS.addVisualizer}/${id}`;

  async function AddVisualize(data) {
    return axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: AddVisualize,
    onSuccess: async (res) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.visualize.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddVisualize;
