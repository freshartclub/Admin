import { useQuery } from '@tanstack/react-query';
import { PICKLIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData() {
  const { data } = await axiosInstance.get(PICKLIST_ENDPOINTS.getPicklists);
  return data.data;
}

export const useGetPicklistMutation = () => {
  return useQuery({
    queryKey: [PICKLIST_ENDPOINTS.getPicklists],
    queryFn: fetchData,
  });
};
