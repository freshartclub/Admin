import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

export const useSuspendArtistMutation = () => {
  const queryClient = useQueryClient();

  async function suspendArtist(newData) {
    const response = await axiosInstance.patch(
      `${ARTIST_ENDPOINTS.suspendArtist}/${newData?.id}?lang=${newData?.selectedLang}`
    );
    return response;
  }

  return useMutation({
    mutationFn: suspendArtist,
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: [ARTIST_ENDPOINTS.getAllArtist] });
      queryClient.invalidateQueries({ queryKey: [ARTIST_ENDPOINTS.getAllArtistInDatabase] });

      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
