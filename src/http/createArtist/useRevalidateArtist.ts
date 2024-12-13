import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

async function revalidateArtist(id) {
  const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.revalidateArtist}/${id}`);
  return response;
}

export const useRevalidateArtist = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: revalidateArtist,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artist.allArtist);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
