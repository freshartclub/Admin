import { z as zod } from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSearchParams } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { FormControl } from '@mui/material';
import { RadioGroup } from '@mui/material';
import { Radio } from '@mui/material';
import useCreateArtistMutation from 'src/http/createArtist/useCreateArtistMutation';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetExistingUserDetails } from './http/useGetExistingUserDetails';
import CreateNewUser from './createNewUser';

// ----------------------------------------------------------------------

export type CreateArtistFormSchemaType = zod.infer<typeof CreateArtistFormSchema>;
export type CreateExistingArtistFormSchemaType = zod.infer<typeof CreateExistingArtistFormSchema>;

export const CreateArtistFormSchema = zod.object({
  avatar: schemaHelper.file({
    message: { required_error: 'Avatar is required!', required: false },
  }),
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
});

export const CreateExistingArtistFormSchema = zod.object({
  existingAvatar: schemaHelper.file({
    message: { required_error: 'Avatar is required!', required: false },
  }),
  existingId: zod.string().min(1, { message: 'Id is required!' }),
  existingName: zod.string().min(1, { message: 'Name is required!' }),
  existingEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  existingPhoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  existingCountry: schemaHelper.objectOrNull<string | null>({
    message: { required_error: 'Country is required!' },
  }),
  existingAddress: zod.string().min(1, { message: 'Address is required!' }),
  existingState: zod.string().min(1, { message: 'State is required!' }),
  existingCity: zod.string().min(1, { message: 'City is required!' }),
  existingZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
});

// ----------------------------------------------------------------------

export function CreateArtistForm() {
  const [value, setValue] = useState('new');

  const id = useSearchParams().get('id');
  const existingUser = useSearchParams().get('extisting');

  const { data, isLoading } = useGetExistingUserDetails(id);
  const { isPending, mutate } = useCreateArtistMutation();

  const methods = useForm({
    resolver: zodResolver(CreateExistingArtistFormSchema),
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    setValue(existingUser ? 'existing' : 'new');
    if (!data) return;
    if (data) {
      reset({
        existingAvatar: data?.avatar || null,
        existingId: data?.userId || '',
        existingName: data?.artistName || '',
        existingEmail: data?.email || '',
        existingPhoneNumber: data?.phone || '',
        existingCountry: data?.address.country || '',
        existingAddress: data?.address.address || '',
        existingState: data?.address.state || '',
        existingCity: data?.address.city || '',
        existingZipCode: data?.address.zipCode || '',
      });
    }
  }, [data, value, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const newData = {
        data: {
          avatar: data.existingAvatar,
          name: data.existingName,
          email: data.existingEmail,
          phoneNumber: data.existingPhoneNumber,
          country: data.existingCountry,
          address: data.existingAddress,
          state: data.existingState,
          city: data.existingCity,
          zipCode: data.existingZipCode,
        },
        isArtist: true,
        value: value,
      };

      mutate(newData);
    } catch (error) {
      console.error(error);
    }
  });

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
              <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                <Box sx={{ mb: 5 }}>
                  <Field.UploadAvatar
                    name="existingAvatar"
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
                    name="existingCountry"
                    label="Country"
                    placeholder="Choose a country"
                  />

                  <Field.Text name="existingState" label="State/region" />
                  <Field.Text name="existingCity" label="City" />
                  <Field.Text name="existingAddress" label="Address" />
                  <Field.Text name="existingZipCode" label="Zip/code" />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <Button type="submit" variant="contained">
                    {isPending ? 'Creating...' : 'Create Artist Account'}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      ) : (
        <CreateNewUser data={data} />
      )}
    </>
  );
}
