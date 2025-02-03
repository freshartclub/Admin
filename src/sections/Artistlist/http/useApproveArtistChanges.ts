import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

async function approveArtistChanges(data) {
  const response = await axiosInstance.patch(
    `${ARTIST_ENDPOINTS.approveArtistChanges}/${data.id}?lang=${data.lang}`,
    data
  );
  return response;
}

export const useApproveArtistChanges = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (body) => approveArtistChanges(body),
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artist.allArtist);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
