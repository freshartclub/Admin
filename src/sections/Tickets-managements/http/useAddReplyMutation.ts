import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { useSearchParams } from 'src/routes/hooks';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

const useAddReplyMutation = () => {
  const queryClient = useQueryClient();
  const id = useSearchParams().get('id');

  async function ReplyTicket(data) {
    const newData = {
      ticketType: data.data.ticketType,
      status: data.data.status,
      message: data.data.message,
      userType: 'admin',
    };
    return axiosInstance.post(`${ARTIST_ENDPOINTS.replyTicket}/${id}`, newData);
  }

  return useMutation({
    mutationFn: ReplyTicket,
    onSuccess: async (res, body) => {
      queryClient.invalidateQueries({
        queryKey: [ARTIST_ENDPOINTS.getTicketReply],
        refetchType: 'all',
      });
      
      toast.success(res.data.message);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddReplyMutation;
