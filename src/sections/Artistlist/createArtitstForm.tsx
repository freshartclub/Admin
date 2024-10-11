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

export function CreateArtistForm({ currentUser }: Props) {
  const router = useRouter();

  const [artistFormData, setArtistFormData] = useState<ArtistDetailType>();

  const [value, setValue] = useState('new');
  const [isArtist, setIsArtist] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParam, setSearchParam] = useSearchParams();

  const id = searchParam.get('id');

  const { isPending, mutate } = useCreateArtistMutation(setLoading);

  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || '',
      F: currentUser?.avatar || null,
      isVerified: currentUser?.isVerified || true,
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      country: currentUser?.country || 'India',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      address: currentUser?.address || '',
      zipCode: currentUser?.zipCode || '',
      company: currentUser?.company || '',
      role: currentUser?.role || '',
    }),
    [currentUser]
  );

  // useLayoutEffect(async ()=>{
  //   if(id){
  //     const { artistDetail } = await axiosInstance.get(
  // `${ARTIST_ENDPOINTS.getAllPendingArtist}`
  //        );
  //     setArtistFormData(artistDetail);
  //   }
  // })

  // useEffect(() => {
  //   const getNewUser = async () => {
  //     const artistDetail = await axiosInstance.get(`${ARTIST_ENDPOINTS.getuser}/${id}`);
  //     setArtistFormData(artistDetail.data);
  //     setValue(artistDetail.data?.userId ? 'new' : 'existing')
  //   };

  //   getNewUser();
  // }, []);

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

  useEffect(() => {
    const result = NewUserSchema.safeParse(values);
    if (!result.success) {
      setLoading(false);
    }
  }, [values]);

  // if (!value) return <LoadingScreen />;

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
                {currentUser && (
                  <Label
                    color={
                      (values.status === 'active' && 'success') ||
                      (values.status === 'banned' && 'error') ||
                      'warning'
                    }
                    sx={{ position: 'absolute', top: 24, right: 24 }}
                  >
                    {values.status}
                  </Label>
                )}

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

                {currentUser && (
                  <FormControlLabel
                    labelPlacement="start"
                    control={
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value !== 'active'}
                            onChange={(event) =>
                              field.onChange(event.target.checked ? 'banned' : 'active')
                            }
                          />
                        )}
                      />
                    }
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Banned
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Apply disable account
                        </Typography>
                      </>
                    }
                    sx={{
                      mx: 0,
                      mb: 3,
                      width: 1,
                      justifyContent: 'space-between',
                    }}
                  />
                )}

                {/* <Field.Switch
                  name="isVerified"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Email verified
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Disabling this will automatically send the user a verification email
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                /> */}

                {currentUser && (
                  <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                    <Button variant="soft" color="error">
                      Delete user
                    </Button>
                  </Stack>
                )}
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
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                {currentUser && (
                  <Label
                    color={
                      (values.status === 'active' && 'success') ||
                      (values.status === 'banned' && 'error') ||
                      'warning'
                    }
                    sx={{ position: 'absolute', top: 24, right: 24 }}
                  >
                    {values.status}
                  </Label>
                )}

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

                {currentUser && (
                  <FormControlLabel
                    labelPlacement="start"
                    control={
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value !== 'active'}
                            onChange={(event) =>
                              field.onChange(event.target.checked ? 'banned' : 'active')
                            }
                          />
                        )}
                      />
                    }
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Banned
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Apply disable account
                        </Typography>
                      </>
                    }
                    sx={{
                      mx: 0,
                      mb: 3,
                      width: 1,
                      justifyContent: 'space-between',
                    }}
                  />
                )}

                {/* <Field.Switch
                  name="isVerified"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Email verified
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Disabling this will automatically send the user a verification email
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                /> */}

                {currentUser && (
                  <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                    <Button variant="soft" color="error">
                      Delete user
                    </Button>
                  </Stack>
                )}
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

                  <Field.Text name="state" label="State/region" />
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
      )}
    </>
  );
}
