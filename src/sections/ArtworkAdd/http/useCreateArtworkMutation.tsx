import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

const useCreateArtworkMutation = () => {
  const navigate = useNavigate();
  async function createArtwork({ newData, onUploadProgress }: { newData: any; onUploadProgress: any }) {
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

    const config = {
      headers,
      onUploadProgress,
    };

    return axiosInstance.post(`${ARTIST_ENDPOINTS.addArtwork}/${newData.id}`, formData, config);
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
