import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const addThemeMutation = () => {
  const navigate = useNavigate();

  async function AddTheme(data) {
    return axiosInstance.post(`${ARTIST_ENDPOINTS.addTheme}`, data);
  }

  return useMutation({
    mutationFn: AddTheme,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.category.theme.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default addThemeMutation;
