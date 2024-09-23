import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { useAppDispatch } from 'src/store/typedReduxHooks';
import { updateUser, setIsAuthorized } from 'src/store/userSlice/userSlice';

import { AUTH_ENDPOINTS } from '../apiEndPoints/Auth';

async function getUser() {
  const { data } = await axiosInstance.get(AUTH_ENDPOINTS.CheckToken);
  return data;
}

const useCheckIsAuthorized = () => {
  const dispatch = useAppDispatch();

  const fetchUser = async () => {
    try {
      const res = await getUser();

      dispatch(updateUser(res.admin));
      dispatch(setIsAuthorized(true));

      return res;
    } catch (error) {
      dispatch(setIsAuthorized(false));
      return error;
    }
  };
  return useQuery({
    queryKey: [AUTH_ENDPOINTS.CheckToken],
    queryFn: fetchUser,
    enabled: true,
  });
};

export default useCheckIsAuthorized;
