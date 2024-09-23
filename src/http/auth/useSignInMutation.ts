import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';
import { setToken } from 'src/utils/tokenHelper';

import { useAppDispatch } from 'src/store/typedReduxHooks';
import { setIsAuthorized } from 'src/store/userSlice/userSlice';

import { toast } from 'src/components/snackbar';

import { AUTH_ENDPOINTS } from '../apiEndPoints/Auth';

let toastId: any;

async function login(input: any) {
  return axiosInstance.post(AUTH_ENDPOINTS.SignIn, input);
}
const useSigInInMutation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: login,

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

export default useSigInInMutation;
