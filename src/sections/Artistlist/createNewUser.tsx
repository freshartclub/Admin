import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { fData } from 'src/utils/format-number';
import { Form, Field } from 'src/components/hook-form';
import useCreateArtistMutation from 'src/http/createArtist/useCreateArtistMutation';
import { CreateArtistFormSchema } from './createArtitstForm';
import axios from 'axios';

const CreateNewUser = ({ existingUser, data, isReadOnly }) => {
  const [value, setValue] = useState('new');
  const [isArtist, setIsArtist] = useState(false);
  const [code, setCode] = useState('');

  const { isPending, mutate } = useCreateArtistMutation();

  const defaultValues = useMemo(() => {
    const obj = {
      avatar: data?.profile?.mainImage ? `https://dev.freshartclub.com/${data?.profile?.mainImage}` : null,
      name: data?.artistName || '',
      artistSurname1: data?.artistSurname1 || '',
      artistSurname2: data?.artistSurname2 || '',
      email: data?.email || '',
      phoneNumber: data?.phone || '',
      country: data?.address.country || '',
      state: data?.address.state || '',
      city: data?.address.city || '',
      zipCode: data?.address.zipCode || '',
    };
    return obj as any;
  }, []);

  const methods = useForm({
    resolver: zodResolver(CreateArtistFormSchema),
    defaultValues,
  });
  const { handleSubmit } = methods;

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
    const getLocation = () => {
      fetchCountryByIP();
    };

    const fetchCountryByIP = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        methods.setValue('country', response.data.country_name);
        methods.setValue('phoneNumber', response.data.country_code);
      } catch (err) {
        console.log('Failed to fetch country data by IP');
      }
    };

    getLocation();
  }, [methods.getValues('country')]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
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
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="name" required label="First Name" />
              <Field.Text name="artistSurname1" required label="Surname 1" />
              <Field.Text name="artistSurname2" label="Surname 2" />
              <Field.Text disabled={isReadOnly} required name="email" label="Email address" />
              <Field.CountrySelect
                fullWidth
                required
                setCode={setCode}
                name="country"
                label="Country"
                placeholder="Choose a country *"
              />
              <Field.Phone
                fetchCode={code ? code : ''}
                name="phoneNumber"
                required
                label="Phone number"
              />

              <Field.Text required name="zipCode" label="Zip/code" />
              <Field.Text required name="state" label="State/region" />
            </Box>
            <Field.Text sx={{ mt: 3 }} required name="city" label="City" />

            <Stack
              alignItems="flex-end"
              direction="row"
              justifyContent="end"
              spacing={2}
              sx={{ mt: 3 }}
            >
              {!existingUser && (
                <Button type="submit" variant="contained">
                  {isPending && !isArtist ? 'Loading..' : 'Create User'}
                </Button>
              )}
              <Button
                onClick={() => setIsArtist(true)}
                type="submit"
                variant="contained"
                color="success"
              >
                {isPending && isArtist ? ' Loading...' : 'Create User With Artist Account'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
};

export default CreateNewUser;
