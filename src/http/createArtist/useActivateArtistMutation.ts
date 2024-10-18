import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from '../apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

const useActivateArtistMutation = (handleOnActivataion) => {
  const navigate = useNavigate();

  const id = useSearchParams().get('id');
  async function activateArtist() {
    if (id) return axiosInstance.post(`${ARTIST_ENDPOINTS.activateArtist}/${id}`);
  }
  return useMutation({
    mutationFn: activateArtist,
    onSuccess: async (res, body) => {
      handleOnActivataion();
      navigate(paths.dashboard.root);
      toast.success(res?.data.message);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useActivateArtistMutation;
