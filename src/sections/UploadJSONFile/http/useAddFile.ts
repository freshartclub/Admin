import { useMutation } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function AddFile(body: any, row: string) {
  const response = axiosInstance.post(`${ARTIST_ENDPOINTS.addFile}?fileType=${row}`, body);
  return response;
}

const useAddFile = (body, row) => {
  return useMutation({
    mutationFn: () => AddFile(body, row),
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddFile;
