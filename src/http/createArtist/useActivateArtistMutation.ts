import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { ARTIST_ENDPOINTS } from '../apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

const useActivateArtistMutation = (handleSuccess) => {
  const navigate = useNavigate();
  const id = useSearchParams().get('id');

  async function activateArtist({ body, selectedLang }: { body: any; selectedLang: string }) {
    let headers;

    if (body?.isContainsImage) {
      const formData = new FormData();

      Object.keys(body).forEach((key) => {
        if (Array.isArray(body[key])) {
          body[key].forEach((item) => {
            if (typeof item === 'object') {
              Object.keys(item).forEach((field, i) => {
                formData.append(field, item[field]);
                if (item[field] instanceof File) {
                  formData.append(field, `${i}`);
                }
              });
            } else {
              formData.append(key, item);
            }
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

    const result = await axiosInstance.post(`${ARTIST_ENDPOINTS.AddArtist}/${id}`, body, {
      headers,
    });

    if (result.status === 200) {
      const response = await axiosInstance.post(
        `${ARTIST_ENDPOINTS.activateArtist}/${id}?lang=${selectedLang}`
      );
      return response;
    }
  }

  return useMutation({
    mutationFn: activateArtist,
    onSuccess: async (res, body) => {
      toast.success(res?.data.message);
      navigate(paths.dashboard.artist.allArtist);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useActivateArtistMutation;
