import { useQuery } from '@tanstack/react-query';
import { PICKLIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function fetchData(id: any, name: string) {
  if (!id) return {};
  const { data } = await axiosInstance.get(
    `${PICKLIST_ENDPOINTS.getPicklistById}/${id}?name=${name}`
  );
  return data.data;
}

export const useGetPicklistById = (id, name) => {
  return useQuery({
    queryKey: [PICKLIST_ENDPOINTS.getPicklistById],
    queryFn: () => fetchData(id, name),
  });
};
