import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

async function approveArtworkChanges(data) {
  const response = await axiosInstance.patch(
    `${ARTIST_ENDPOINTS.approveArtworkChanges}/${data.id}?lang=${data.lang}`,
    data
  );
  return response;
}

export const useApproveArtworkChanges = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (body) => approveArtworkChanges(body),
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artwork.artworkList);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
