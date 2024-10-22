import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from '../apiEndPoints/Artist';

const useAddArtistMutation = (handleOnSuccess) => {
  const [searchParam, setSearchParam] = useSearchParams();
  const id = searchParam.get('id');

  async function addArtist({ body, onUploadProgress }: { body: any; onUploadProgress: any }) {
    let headers;
    if (body?.isContainsImage) {
      const formData = new FormData();

      Object.keys(body).forEach((key) => {
        if (Array.isArray(body[key])) {
          body[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, body[key]);
        }
      });

      body = formData;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      headers = { 'Content-Type': 'application/json' };
    }

    const config = {
      headers,
      onUploadProgress,
    };

    // if (id) return axiosInstance.post(`${ARTIST_ENDPOINTS.AddArtist}/${id}`, body, config);
    // return axiosInstance.post(`${ARTIST_ENDPOINTS.AddArtist}`, body, config);
    return axiosInstance.post(`${ARTIST_ENDPOINTS.AddArtist}/${id}`, body, config);
  }

  return useMutation({
    mutationFn: addArtist,
    onSuccess: async (res, body) => {
      setSearchParam({ id: res.data.id });
      handleOnSuccess(body.body);
    },

    onError: (res) => {
      toast.error(res.response?.data?.message);
    },
  });
};

export default useAddArtistMutation;
