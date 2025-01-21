import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const useAddHomeArtwork = (id) => {
  const navigate = useNavigate();

  let url = ARTIST_ENDPOINTS.addHomeArtwork;
  if (id) url = `${ARTIST_ENDPOINTS.addHomeArtwork}/${id}`;

  async function addCircle(data) {
    return axiosInstance.post(url, data);
  }

  return useMutation({
    mutationFn: addCircle,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artwork.homeArtwork.list);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddHomeArtwork;
