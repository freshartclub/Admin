import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const useAddDisciplineMutation = (id) => {
  const navigate = useNavigate();

  let url = `${ARTIST_ENDPOINTS.addDiscipline}`;
  if (id) url = `${ARTIST_ENDPOINTS.addDiscipline}?id=${id}`;

  async function AddDiscipline(data) {
    return axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: AddDiscipline,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.category.discipline.list);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddDisciplineMutation;
