import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useSearchParams } from 'src/routes/hooks';

import {
  Avatar,
  CircularProgress,
  FormControl,
  Link,
  ListItemText,
  Radio,
  RadioGroup,
  TableCell,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import useCreateArtistMutation from 'src/http/createArtist/useCreateArtistMutation';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { imgUrl } from 'src/utils/BaseUrls';
import { fData } from 'src/utils/format-number';
import { getCityStateFromZipCountry } from '../artist/addArtist/AddressAutoComplete';
import CreateNewUser from './createNewUser';
import { useGetExistingUserDetails } from './http/useGetExistingUserDetails';
import { useGetUserByIdMutation } from './http/userGetUserByIdMutation';

// ----------------------------------------------------------------------

export type CreateArtistFormSchemaType = zod.infer<typeof CreateArtistFormSchema>;
export type CreateExistingArtistFormSchemaType = zod.infer<typeof CreateExistingArtistFormSchema>;

export const CreateArtistFormSchema = zod.object({
  avatar: schemaHelper.file({
    message: { required_error: 'Avatar is required!', required: false },
  }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  artistSurname1: zod.string().min(1, { message: 'Surname 1 is required!' }),
  artistSurname2: zod.string(),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull<string | null>({
    message: { required_error: 'Country is required!' },
  }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
});

export const CreateExistingArtistFormSchema = zod.object({
  existingAvatar: schemaHelper.file({
    message: { required_error: 'Avatar is required!', required: false },
  }),
  existingName: zod.string().min(1, { message: 'Name is required!' }),
  existingArtistSurname1: zod.string().min(1, { message: 'Surname 1 is required!' }),
  existingArtistSurname2: zod.string(),
  existingEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  existingPhoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  existingCountry: schemaHelper.objectOrNull<string | null>({
    message: { required_error: 'Country is required!' },
  }),
  existingState: zod.string().min(1, { message: 'State is required!' }),
  existingCity: zod.string().min(1, { message: 'City is required!' }),
  existingZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
});

// ----------------------------------------------------------------------

export function CreateArtistForm() {
  const [value, setValue] = useState('new');
  const [open, setOpen] = useState(true);
  const [_id, setId] = useState('');
  const [code, setCode] = useState('');
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  let id = useSearchParams().get('id');
  const existingUser = useSearchParams().get('extisting');
  const isReadOnly = id !== null;

  const methods = useForm({
    resolver: zodResolver(CreateExistingArtistFormSchema),
    defaultValues: {
      existingAvatar: null,
      existingId: '',
      existingName: '',
      existingArtistSurname1: '',
      existingArtistSurname2: '',
      existingEmail: '',
      existingPhoneNumber: '',
      existingCountry: '',
      existingState: '',
      existingCity: '',
      existingZipCode: '',
    },
  });

  const { data, isLoading } = useGetExistingUserDetails(id);
  const { isPending, mutate } = useCreateArtistMutation();

  const { reset, watch, handleSubmit } = methods;
  const debounceUserId = useDebounce(methods.getValues('existingId'), 500);
  const {
    refetch,
    data: artistData,
    isLoading: artistLoading,
  } = useGetUserByIdMutation(debounceUserId);
  const values = watch();

  useEffect(() => {
    if (!data) return;
    if (data) {
      reset({
        existingAvatar: data?.profile?.mainImage
          ? `${imgUrl}/users/${data?.profile?.mainImage}`
          : null,
        existingId: data?.userId || '',
        existingName: data?.artistName || '',
        existingArtistSurname1: data?.artistSurname1 || '',
        existingArtistSurname2: data?.artistSurname2 || '',
        existingEmail: data?.email || '',
        existingPhoneNumber: data?.phone || '',
        existingCountry: data?.address.country || '',
        existingState: data?.address.state || '',
        existingCity: data?.address.city || '',
        existingZipCode: data?.address.zipCode || '',
      });
    }
    setValue(existingUser === 'true' ? 'existing' : 'new');
  }, [data, value]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const newData = {
        data: {
          avatar: data.existingAvatar,
          name: data.existingName,
          artistSurname1: data.existingArtistSurname1,
          artistSurname2: data.existingArtistSurname2,
          email: data.existingEmail,
          phoneNumber: data.existingPhoneNumber,
          country: data.existingCountry,
          state: data.existingState,
          city: data.existingCity,
          zipCode: data.existingZipCode,
        },
        _id: _id,
        isArtist: true,
        value: value,
      };

      mutate(newData);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    if (id) {
      setOpen(false);
    }
    if (methods.getValues('existingId') !== '') {
      refetch();
    }
  }, [debounceUserId]);

  const refillData = (data) => {
    setId(data?._id);
    methods.setValue('existingAvatar', `${imgUrl}/users/${data?.profile?.mainImage}`);
    methods.setValue('existingId', data?.userId);
    methods.setValue('existingName', data?.artistName);
    methods.setValue('existingArtistSurname1', data?.artistSurname1);
    methods.setValue('existingArtistSurname2', data?.artistSurname2);
    methods.setValue('existingEmail', data?.email);
    methods.setValue('existingPhoneNumber', data?.phone);
    methods.setValue('existingCountry', data?.address?.country);
    methods.setValue('existingState', data?.address?.state);
    methods.setValue('existingCity', data?.address?.city);
    methods.setValue('existingZipCode', data?.address?.zipCode);
    setOpen(false);
  };

  useEffect(() => {
    const getLocation = () => {
      fetchCountryByIP();
    };

    const fetchCountryByIP = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        if (response.status === 200) {
          methods.setValue('existingCountry', response.data.country_name);
          setCode(response.data.country_code);
        }
      } catch (err) {
        console.log('Failed to fetch country data by IP');
      }
    };

    getLocation();
  }, [methods.getValues('existingCountry')]);

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const handleRemoveFile = () => methods.setValue('existingAvatar', null);

  const country = methods.watch('existingCountry');
  const zipCode = methods.watch('existingZipCode');

  useEffect(() => {
    if (zipCode && zipCode.length > 4 && country) {
      getCityStateFromZipCountry(zipCode, country, apiKey).then(({ city, state }) => {
        methods.setValue('existingCity', city || '');
        methods.setValue('existingState', state || '');
      });
    }
  }, [zipCode, country]);

  if (isLoading) return <LoadingScreen />;

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
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Box sx={{ mb: 5 }}>
                  <Field.Upload
                    name="existingAvatar"
                    maxSize={3145728}
                    onDelete={handleRemoveFile}
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
                <Field.Text
                  sx={{ pb: 3 }}
                  required
                  disabled={isReadOnly}
                  onClick={() => setOpen(true)}
                  name="existingId"
                  placeholder="Search By UserId, Name or Email"
                  label="Existing User Account Id"
                />
                {methods.getValues('existingId') && open && (
                  <div className="absolute top-[5.5rem] w-[93%] rounded-lg z-10 h-[30vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto">
                    <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {artistLoading ? (
                        <TableCell>
                          <CircularProgress size={30} />
                        </TableCell>
                      ) : artistData && artistData.length > 0 ? (
                        artistData.map((i, j) => (
                          <TableCell
                            onClick={() => refillData(i)}
                            key={j}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              },
                            }}
                          >
                            <Stack spacing={2} direction="row" alignItems="center">
                              <Avatar alt={i?.artistName} src={`${imgUrl}/users/${i?.mainImage}`} />

                              <ListItemText
                                disableTypography
                                primary={
                                  <Typography variant="body2" noWrap>
                                    {name(i)} - {i?.userId}
                                  </Typography>
                                }
                                secondary={
                                  <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                                    {i?.email}
                                  </Link>
                                }
                              />
                            </Stack>
                          </TableCell>
                        ))
                      ) : (
                        <TableCell>No User Found</TableCell>
                      )}
                    </TableRow>
                  </div>
                )}
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <Field.Text
                    InputLabelProps={{ shrink: true }}
                    name="existingName"
                    required
                    label="First Name"
                  />
                  <Field.Text
                    InputLabelProps={{ shrink: true }}
                    name="existingArtistSurname1"
                    required
                    label="Surname 1"
                  />
                  <Field.Text
                    InputLabelProps={{ shrink: true }}
                    name="existingArtistSurname2"
                    label="Surname 2"
                  />
                  <Field.Text
                    disabled={isReadOnly}
                    InputLabelProps={{ shrink: true }}
                    required
                    name="existingEmail"
                    label="Email Address"
                  />

                  {id ? (
                    <Field.CountrySelect
                      fullWidth
                      name="existingCountry"
                      disabled={isReadOnly}
                      setCode={setCode}
                      label="Country *"
                      placeholder="Choose a country"
                    />
                  ) : (
                    <Field.CountrySelect
                      fullWidth
                      name="existingCountry"
                      disabled={isReadOnly}
                      setCode={setCode}
                      value={country}
                      label="Country *"
                      placeholder="Choose a country"
                    />
                  )}

                  <Field.Phone
                    disabled={isReadOnly}
                    fetchCode={code ? code : ''}
                    name="existingPhoneNumber"
                    label="Phone Number"
                  />

                  <Field.Text
                    InputLabelProps={{ shrink: true }}
                    name="existingZipCode"
                    required
                    label="Zip/code"
                  />
                  <Field.Text
                    InputLabelProps={{ shrink: true }}
                    name="existingCity"
                    required
                    label="City"
                  />
                </Box>

                <Field.Text
                  sx={{ mt: 3 }}
                  InputLabelProps={{ shrink: true }}
                  name="existingState"
                  required
                  label="State/region"
                />

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <Button disabled={isPending} type="submit" variant="contained">
                    {isPending ? 'Creating...' : 'Create Artist Account'}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      ) : (
        <CreateNewUser existingUser={existingUser} data={data} isReadOnly={isReadOnly} />
      )}
    </>
  );
}
