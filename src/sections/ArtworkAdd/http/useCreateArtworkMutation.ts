import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { toast } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

const useCreateArtworkMutation = (id) => {
  const navigate = useNavigate();

  async function createArtwork({
    newData,
    onUploadProgress,
  }: {
    newData: any;
    onUploadProgress: any;
  }) {
    const formData = new FormData();

    newData?.data?.images &&
      newData?.data?.images?.forEach((item: any) => {
        if (typeof item === 'object') {
          formData.append('images', item);
        }
      });

    delete newData?.data?.images;

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

    let url = `${ARTIST_ENDPOINTS.addArtwork}/${newData.id}`;
    if (id) url = `${ARTIST_ENDPOINTS.addArtwork}/${newData.id}?artworkId=${id}`;

    return axiosInstance.post(url, formData, config);
  }

  return useMutation({
    mutationFn: createArtwork,
    onSuccess: async (res, body) => {
      toast.success(res.data.message);
      navigate(
        paths.dashboard.artwork.artworkDetail + '?id=' + res.data.data._id + '&preview=true'
      );
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useCreateArtworkMutation;
