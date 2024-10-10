import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import axiosInstance from 'src/utils/axios';

import {  USER_ENDPOINTS } from '../apiEndPoints/Artist';

async function getUserList() {
  const { data } = await axiosInstance.get(`${USER_ENDPOINTS.getUserList}`);
  return data.data;
}

const useUserGetMutation = () => {
//   const [searchParam, setSearchParam] = useSearchParams();
 
  const fetchUser = async () => {
    try {
      const res = await getUserList();

      return res;
    } catch (error) {
      return error;
    }
  };

  console.log(fetchUser)
  return useQuery({
    queryKey: [USER_ENDPOINTS.getUserList],
    queryFn: fetchUser,
    enabled: false,
  });
};



export default useUserGetMutation;
