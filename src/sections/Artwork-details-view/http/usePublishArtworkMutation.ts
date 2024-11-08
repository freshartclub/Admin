import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const usePublishArtworkMutation = (id) => {
  const navigate = useNavigate();

  async function PublishArtwork() {
    return axiosInstance.patch(`${ARTIST_ENDPOINTS.publishArtwork}/${id}`);
  }

  return useMutation({
    mutationFn: PublishArtwork,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artwork.artworkList);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default usePublishArtworkMutation;
