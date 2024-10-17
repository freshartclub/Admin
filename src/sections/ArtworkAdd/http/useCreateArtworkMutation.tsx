import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

const useCreateArtworkMutation = () => {
  const navigate = useNavigate();
  async function createArtwork(newData) {
    const formData = new FormData();

    Object.keys(newData.data).forEach((key) => {
      if (Array.isArray(newData.data[key])) {
        newData.data[key].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, newData.data[key]);
      }
    });

    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    return axiosInstance.post(`${ARTIST_ENDPOINTS.addArtwork}/${newData.id}`, formData, {
      headers,
    });
  }

  return useMutation({
    mutationFn: createArtwork,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(paths.dashboard.artwork.artworkList);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useCreateArtworkMutation;
