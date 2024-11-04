import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const useAddTicketMutation = () => {
  const navigate = useNavigate();
  async function AddTicket(data) {
    return axiosInstance.post(`${ARTIST_ENDPOINTS.addTicket}`, data);
  }

  return useMutation({
    mutationFn: AddTicket,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.tickets.allList);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddTicketMutation;
