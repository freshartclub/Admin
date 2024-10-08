import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { today } from 'src/utils/format-time';

import { PRODUCT_GENDER_OPTIONS, PRODUCT_LANGUAGE_OPTIONS } from 'src/_mock';
import useAddArtistMutation from 'src/http/createArtist/useCreateArtistMutation';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { GooglePlacesAutoComplete } from 'src/components/hook-form/GooglePlacesAutoComplete';
import Autocomplete from 'react-google-autocomplete';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  // accountId: zod.string().min(1, { message: 'Account Id is required!' }),
  artistName: zod.string().min(1, { message: 'artistName is required!' }),
  artistSurname1: zod.string().min(1, { message: 'ArtistSurname is required!' }),
  artistSurname2: zod.string(),
  nickName: zod.string(),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  createDate: zod.string(),
  language: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  state: zod.string().min(1, { message: 'state is required!' }),
  residentialAddress: zod.string().min(1, { message: 'residentialAddress is required!' }),
  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email residentialAddress!' }),
  gender: zod.string().min(1, { message: 'Gender is required!' }),
  notes: zod.string(),
});

// ----------------------------------------------------------------------

export function GeneralInformation({
  artistFormData,
  setArtistFormData,
  setTabState,
  setTabIndex,
  tabIndex,
  tabState,
}: AddArtistComponentProps) {
  const [searchParam, setSearchParam] = useState();
  const [includeTaxes, setIncludeTaxes] = useState(false);

  const handleSuccess = (data) => {
    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
  };

  const { isPending, mutate } = useAddArtistMutation(handleSuccess);

  const defaultValues = useMemo(
    () => ({
      artistName: artistFormData?.artistName || '',
      artistSurname1: artistFormData?.artistSurname1 || '',
      artistSurname2: artistFormData?.artistSurname2 || '',
      nickName: artistFormData?.nickName || '',
      country: artistFormData?.country || 'Spain',
      zipCode: artistFormData?.zipCode || '',
      city: artistFormData?.city || '',
      state: artistFormData?.state || '',
      residentialAddress: artistFormData?.residentialAddress || '',
      phone: artistFormData?.phone || '',
      email: artistFormData?.email || '',
      language: artistFormData?.language || [],
      gender: artistFormData?.gender || '',
      createDate: artistFormData?.createDate || today(),
      notes: artistFormData?.notes || '',
    }),
    [artistFormData]
  );

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = formProps;

  // const values = watch();

  // useEffect(() => {
  //   if (window.location.hostname === 'localhost' && window.location.port === '5173') {
  //     // setValue('accountId', artistFormData?.accountId || '12345');
  //     setValue('artistName', artistFormData?.artistName || 'John');
  //     setValue('artistSurname1', artistFormData?.artistSurname1 || 'Doe');
  //     setValue('artistSurname2', artistFormData?.artistSurname2 || 'Smith');
  //     setValue('nickName', artistFormData?.nickName || 'Sunset Bliss');
  //     // setValue('country', artistFormData?.country || 'USA');
  //     setValue('createDate', artistFormData?.createDate || new Date().toISOString());
  //     setValue('language', artistFormData?.language || ['English']);
  //     setValue('zipCode', artistFormData?.zipCode || '90210');
  //     setValue('city', artistFormData?.city || 'Los Angeles');
  //     setValue('state', artistFormData?.state || 'California');
  //     setValue('residentialAddress', artistFormData?.residentialAddress || '123 Art St.');
  //     setValue('phone', artistFormData?.phone || '+917879610316');
  //     setValue('email', artistFormData?.email || 'artist@example.com');
  //     setValue('gender', artistFormData?.gender || 'Men');
  //     setValue('notes', artistFormData?.notes || 'Mock data for testing');
  //   }
  // }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });

    data.count = 1;

    mutate({ body: data });
  });

  const renderDetails = (
    <Card>
      <CardHeader title="General Informations" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="artistName" label="Artist name" />

          <Field.Text name="artistSurname1" label="Artist Surname 1" />

          <Field.Text name="artistSurname2" label="Artist Surname 2" />
        </Box>

        
        

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="nickName" label="Artist Nickname" />
        </Box>

        <Field.CountrySelect
          fullWidth
          name="country"
          label="Country"
          placeholder="Choose a country"
        />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="zipCode" label="Zip/code" />
          <Field.Text name="city" label="City" />
          <Field.Text name="state" label="state/State/Region" />
        </Box>

        <Field.Text name="residentialAddress" label="residentialAddress" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Phone name="phone" label="Phone number" helperText="Good to go" />

          <Field.Text name="email" label="Email" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.MultiSelect
            helperText=""
            checkbox
            name="language"
            placeholder="Select language"
            label="language"
            options={PRODUCT_LANGUAGE_OPTIONS}
          />

          <Field.SingelSelect
            checkbox
            name="gender"
            label="Gender"
            options={PRODUCT_GENDER_OPTIONS}
          />
        </Box>

        <Field.Text name="notes" label="Internal Note description" multiline rows={4} />
      </Stack>
    </Card>
  );

  return (
    <Form methods={formProps} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {renderDetails}

        <div className="flex justify-end">
          <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
            {isPending ? 'Loading...' : 'Save & Next'}
          </button>
        </div>
      </Stack>
    </Form>
  );
}
