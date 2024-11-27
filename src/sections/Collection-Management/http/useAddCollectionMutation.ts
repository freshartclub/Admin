import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import { form } from 'src/theme/core/components/form';
import axiosInstance from 'src/utils/axios';

const useAddCollectionMutation = (id) => {
  const navigate = useNavigate();

  let url = `${ARTIST_ENDPOINTS.addCollection}`;
  if (id) url = `${ARTIST_ENDPOINTS.addCollection}?id=${id}`;

  async function AddCollection(data) {
    return axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: AddCollection,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artwork.collection_management.list);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddCollectionMutation;
