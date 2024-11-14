import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

const useAddIncidentMutation = () => {
  const navigate = useNavigate();
  async function AddIncident(data) {
    return axiosInstance.post(`${ARTIST_ENDPOINTS.addIncident}`, data);
  }

  return useMutation({
    mutationFn: AddIncident,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.tickets.allIncident);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddIncidentMutation;
