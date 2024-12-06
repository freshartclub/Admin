import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

export const useRejectChanges = (id) => {
  const navigate = useNavigate();
  async function rejectChanges() {
    const response = await axiosInstance.patch(`${ARTIST_ENDPOINTS.rejectChanges}/${id}`);
    return response;
  }

  return useMutation({
    mutationFn: rejectChanges,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artist.allArtist);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
