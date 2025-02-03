import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

async function UnSuspendArtist(id, selectedLang) {
  const response = await axiosInstance.patch(
    `${ARTIST_ENDPOINTS.unSuspendArtist}/${id}?lang=${selectedLang}`
  );
  return response;
}

export const useUnsuspendArtistMutation = (id, selectedLang) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => UnSuspendArtist(id, selectedLang),
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [`${ARTIST_ENDPOINTS.suspendedArtist}`],
        refetchType: 'all',
      });

      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};
