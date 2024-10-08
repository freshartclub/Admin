import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';
import { setToken } from 'src/utils/tokenHelper';

import { useAppDispatch } from 'src/store/typedReduxHooks';
import { setIsAuthorized } from 'src/store/userSlice/userSlice';

import { toast } from 'src/components/snackbar';

import { AUTH_ENDPOINTS } from '../apiEndPoints/Auth';
import { paths } from 'src/routes/paths';
import { useSearchParams } from 'react-router-dom';

let toastId: any;

async function otpVerify(input: any) {
  return axiosInstance.post(AUTH_ENDPOINTS.ValidateOtp, input);
}
const useOtpMutation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get("id");
  

  return useMutation({
    mutationFn: otpVerify,

    onSuccess: async (res, input) => {

      setToken(res.data.token, input.rememberMe);
      
      dispatch(setIsAuthorized(true));
      toast.dismiss(toastId);
      toast.success(res.data.message);
      navigate('/', {
        replace: true,
      });
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useOtpMutation;