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
import CreateNewUser from './createNewUser';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  avatar: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull<string | null>({
    message: { required_error: 'Country is required!' },
  }),
  address: zod.string().min(1, { message: 'Address is required!' }),

  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),

  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  // Not required
  status: zod.string(),
  isVerified: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export function CreateArtistForm() {
  const router = useRouter();

  const [artistFormData, setArtistFormData] = useState<ArtistDetailType>();

  const [value, setValue] = useState('new');
  const [isArtist, setIsArtist] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParam, setSearchParam] = useSearchParams();

  const id = searchParam.get('id');
  const existingUser = searchParam.get('extisting');

  const { isPending, mutate } = useCreateArtistMutation(setLoading);
  

  const { data, isLoading, isError } = useGetExistingUserDetails(id);

  const methods = useForm<NewUserSchemaType>({
    resolver: zodResolver(NewUserSchema),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  

  useEffect(() => {
    watch("email");
    if (!data) return;
    const obj = {
      status: data?.status || '',
      F: data?.avatar || null,
      isVerified: data?.isVerified || false,
      name: data?.name || '',
      email: data?.email || '',
      phoneNumber: data?.phoneNumber || '',
      country: data?.country || 'spain',
      state: data?.state || '',
      city: data?.city || '',
      address: data?.address || '',
      zipCode: data?.zipCode || '',
      company: data?.company || '',
      role: data?.role || '',
    };
    methods.setValue("email", obj.email);
    methods.setValue("email", obj.email);

    
  }, [data]);

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const newData = {
        data: data,
        isArtist: isArtist,
        value: value,
      };
      mutate(newData);
    } catch (error) {
      console.error(error);
    }
  });

  if(isLoading) return;

  return (
    <>
      <div className="pb-10">
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
          >
            <div className="flex items-center gap-5">
              <FormControlLabel
                onChange={(e) => setValue(e.target.value)}
                value="new"
                // checked={value === 'new'}
                control={<Radio checked={value === 'new'} />}
                label="New User"
              />
              <FormControlLabel
                onChange={(e) => setValue(e.target.value)}
                value="existing"
                checked={value === 'existing'}
                control={<Radio />}
                label="Existing User"
              />
            </div>
          </RadioGroup>
        </FormControl>
      </div>

      {value === 'existing' ? (
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
                <Field.Text sx={{ pb: 3 }} name="existingId" label="Existing User Account Id" />
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <Field.Text name="existingName" label="Full name" />
                  <Field.Text name="existingEmail" label="Email address" />
                  <Field.Phone name="existingPhoneNumber" label="Phone number" />

                  <Field.CountrySelect
                    fullWidth
                    name="country"
                    label="Country"
                    placeholder="Choose a country"
                  />

                  <Field.Text name="existingState" label="State/region" />
                  <Field.Text name="existingCity" label="City" />
                  <Field.Text name="existingAddress" label="Address" />
                  <Field.Text name="existingZipCode" label="Zip/code" />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Create Artist Account
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      ) : (
        <CreateNewUser data={data}/>
      )}
    </>
  );
}
