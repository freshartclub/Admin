import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from '../apiEndPoints/Artist';
import { paths } from 'src/routes/paths';

const useAddArtistMutation = (handleOnSuccess) => {
  const navigate = useNavigate();
  const [searchParam, setSearchParam] = useSearchParams();
  const id = searchParam.get('id');

  async function addArtist({ body, onUploadProgress }: { body: any; onUploadProgress: any }) {
    let headers;

    if (body?.isContainsImage) {
      const formData = new FormData();

      body?.additionalImage &&
        body?.additionalImage?.forEach((element) => {
          if (typeof element === 'object') {
            formData.append('additionalImage', element);
          }
        });

      body?.additionalVideo &&
        body?.additionalVideo?.forEach((element) => {
          if (typeof element === 'object') {
            formData.append('additionalVideo', element);
          }
        });

      body?.uploadDocs &&
        body?.uploadDocs?.forEach((element) => {
          if (typeof element === 'object') {
            formData.append('uploadDocs', element);
          }
        });

      delete body?.additionalImage;
      delete body?.additionalVideo;
      delete body?.uploadDocs;

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

    return axiosInstance.post(`${ARTIST_ENDPOINTS.AddArtist}/${id}`, body, config);
  }

  return useMutation({
    mutationFn: addArtist,
    onSuccess: async (res, body) => {
      setSearchParam({ id: res.data.id });
      handleOnSuccess(body.body);
      if (body.body.count === 7) {
        navigate(paths.dashboard.artist.artistPendingRequest);
      }
    },

    onError: (res) => {
      toast.error(res.response?.data?.message);
    },
  });
};

export default useAddArtistMutation;
