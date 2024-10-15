import React from 'react'
import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FormControl } from '@mui/material';
import { FormLabel } from '@mui/material';
import { RadioGroup } from '@mui/material';
import { Radio } from '@mui/material';
import useCreateArtistMutation from 'src/http/createArtist/useCreateArtistMutation';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ArtistDetailType } from 'src/types/artist/ArtistDetailType';
import axiosInstance from 'src/utils/axios';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { artistData } from '../KBS/data';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetExistingUserDetails } from './http/useGetExistingUserDetails';
import { NewUserSchema, NewUserSchemaType } from '../AddCreadentialForm';


const CreateNewUser = ({data}) => {

  const [value, setValue] = useState('new');
  const [isArtist, setIsArtist] = useState(false);
  const [loading, setLoading] = useState(false);
  const defaultValues = useMemo(()=>{
    const obj = {
      
      avatar: data?.avatar || null,
 
      name: data?.artistName || '',
      email: data?.email || '',
      phoneNumber: data?.phone || '',
      country: data?.address.country || 'spain',
      state: data?.address.state || '',
      city: data?.address.city || '',
      zipCode: data?.address.zipCode || '',
    };
    return obj;
  },[])

  const methods = useForm<NewUserSchemaType>({
    resolver: zodResolver(NewUserSchema),
    defaultValues
  });


  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <Form methods={methods}>
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Card sx={{ pt: 10, pb: 5, px: 3 }}>
          <Box sx={{ mb: 5 }}>
            <Field.UploadAvatar
              name="avatar"
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
          {/* <Field.Text sx={{pb:3}} name="name" label="Existing User Account Id" /> */}
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="name" label="Full name" />
            <Field.Text name="email" label="Email address" />
            <Field.Phone name="phoneNumber" label="Phone number" />

            <Field.CountrySelect
              fullWidth
              name="country"
              label="Country"
              placeholder="Choose a country"
            />

            <Field.Text name="country" label="State/region" />
            <Field.Text name="city" label="City" />
            <Field.Text name="address" label="Address" />
            <Field.Text name="zipCode" label="Zip/code" />
          </Box>

          <Stack
            alignItems="flex-end"
            direction="row"
            justifyContent="end"
            spacing={2}
            sx={{ mt: 3 }}
          >
            <LoadingButton
              onClick={() => {
                setIsArtist(false);
                setLoading(true);
              }}
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {!isArtist && loading ? 'loading..' : ' Create User'}
            </LoadingButton>
            <LoadingButton
              onClick={() => {
                setIsArtist(true);
                setLoading(true);
              }}
              type="submit"
              variant="contained"
              color="success"
              loading={isSubmitting}
            >
              {isArtist && loading ? ' Loding...' : 'Create User With Artist Account'}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  </Form>
  )
}

export default CreateNewUser