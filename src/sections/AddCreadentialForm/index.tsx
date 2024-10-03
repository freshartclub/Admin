

import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { getToken } from "src/utils/tokenHelper";
import axiosInstance from 'src/utils/axios';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { useDispatch } from 'react-redux';

const BASE_URL =  import.meta.env.VITE_SERVER_BASE_URL
// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  insigniaImage: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
  credentialName: zod.string().min(1, { message: 'Name is required!' }),
  credentialGroup: zod.string().min(1, { message: 'Group is required!' }),
  credentialPriority: zod.string().min(1, { message: 'Display Priority is required!' }),
  isActive: zod.boolean(),
});

// ----------------------------------------------------------------------


type Props = {
  CreatentialForm?: AddArtistComponentProps;
};

export function AddCreadentialForm({ CreatentialForm }: Props) {
 
  const token = getToken();
  const dispatch = useDispatch();
  const router = useRouter();

  
  const defaultValues = useMemo(
    () => ({
      insigniaImage: CreatentialForm?.insigniaImage || null,
      isActive: CreatentialForm?.isActive || true,
      credentialName: CreatentialForm?.credentialName || '',
      credentialGroup: CreatentialForm?.credentialGroup || '',
      credentialPriority: CreatentialForm?.credentialPriority || '',
    }),
    [CreatentialForm]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  

const onSubmit = handleSubmit(async (data) => {
  const toastId = toast.loading("Loading...");

  try {
    const formData = new FormData();
    formData.append('credentialGroup', data.credentialGroup);
    formData.append('credentialName', data.credentialName);
    formData.append('credentialPriority', data.credentialPriority);
    formData.append('insigniaImage', data.insigniaImage);
    formData.append('isActive', data.isActive);
    formData.append('token',token);

    console.log(formData);
    


    
    const response = await axios.post( BASE_URL + '/api/admin/create-insignias',formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        
        'Content-Type': 'multipart/form-data', 
      },
    });
    
    // if (!response.data.success) {
    //   throw new Error(response.data.message);
    // }

    toast.success("Credential form successful");
    reset()
  } catch (error) {
    console.error("Credential form failed", error.response ? error.response.data : error.message);
    toast.error("Credential form failed");
  }
  
  toast.dismiss(toastId);
});


  
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="insigniaImage"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
            >
              <Field.Text name="credentialName" label="Credentials and Insignias Area Name" /> 
              <Field.Text name="credentialGroup" label="Group" />
              <Field.Text name="credentialPriority" label="Display Priority" />
            </Box>
            <div className='flex justify-between items-center mt-9'>
              <Field.Switch
                name="isActive"
                labelPlacement="start"
                label={<></>}
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!CreatentialForm ? 'Credentials and Insignias Area' : 'Credentials and Insignias Area'}
                </LoadingButton>
              </Stack>
            </div>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
