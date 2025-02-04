import { useMutation } from '@tanstack/react-query';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';

async function AddFile(data: any) {
  const response = axiosInstance.post(
    `${ARTIST_ENDPOINTS.addFile}?fileType=${data?.row}`,
    data.body
  );
  return response;
}

const useAddFile = () => {
  return useMutation({
    mutationFn: (data) => AddFile(data),
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
    },

    onError: (res: any) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useAddFile;
