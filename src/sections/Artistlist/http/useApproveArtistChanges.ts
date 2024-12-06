import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

export const useApproveArtistChanges = (data, id) => {
  const navigate = useNavigate();
  async function approveArtistChanges() {
    const response = await axiosInstance.patch(
      `${ARTIST_ENDPOINTS.approveArtistChanges}/${id}`,
      data
    );
    return response;
  }

  return useMutation({
    mutationFn: approveArtistChanges,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artist.allArtist);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
