import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

import { ARTIST_ENDPOINTS } from '../apiEndPoints/Artist';
import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

const useCreateArtistMutation = () => {
  const navigate = useNavigate();
  const id = useSearchParams().get('id');
  const existing = useSearchParams().get('extisting');

  async function CreateArtist(newData) {
    const formData = new FormData();

    if (typeof newData?.data.avatar === 'string') {
      formData.append('avatar', newData?.data.avatar);
    } else if (newData?.data.avatar instanceof File) {
      formData.append('avatar', newData?.data.avatar);
    }

    delete newData.data.avatar;

    Object.keys(newData.data).forEach((key) => {
      if (Array.isArray(newData.data[key])) {
        newData.data[key].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, newData.data[key]);
      }
    });

    formData.append('isArtist', newData.isArtist);
    formData.append('value', newData.value);
    if (newData.isArtist == true && existing == null) {
      formData.append('_id', newData?._id);
    }

    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    return axiosInstance.post(`${ARTIST_ENDPOINTS.createNewUser}/${id}`, formData, { headers });
  }

  return useMutation({
    mutationFn: CreateArtist,
    onSuccess: async (res, body) => {
      if (body.isArtist) {
        navigate(paths.dashboard.artist.addArtist + '?id=' + res.data.id);
      } else {
        navigate(paths.dashboard.user.list);
      }

      toast.success(res.data.message);
    },

    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useCreateArtistMutation;
