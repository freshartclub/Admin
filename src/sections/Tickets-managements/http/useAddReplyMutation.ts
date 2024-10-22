import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { useSearchParams } from 'src/routes/hooks';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

const useAddReplyMutation = () => {
  const id = useSearchParams().get('id');

  async function ReplyTicket(data: any) {
    return axiosInstance.post(`${ARTIST_ENDPOINTS.replyTicket}/${id}`, data);
  }
  return useMutation({
    mutationFn: ReplyTicket,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddReplyMutation;
