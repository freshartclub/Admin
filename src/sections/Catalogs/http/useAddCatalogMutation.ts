import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const useAddCatalogMutation = (id) => {
  const navigate = useNavigate();

  let url = `${ARTIST_ENDPOINTS.addCatalog}`;
  if (id) url = `${ARTIST_ENDPOINTS.addCatalog}?id=${id}`;

  async function AddCatalog(data) {
    return axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: AddCatalog,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artwork.catalog.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddCatalogMutation;
