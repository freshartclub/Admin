import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const useAddCoupon = (id) => {
  const navigate = useNavigate();

  async function addCoupon(data) {
    return axiosInstance.post(`${ARTIST_ENDPOINTS.addCoupon}/${id}`, data);
  }

  return useMutation({
    mutationFn: addCoupon,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.couponandpromotions.list);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddCoupon;
