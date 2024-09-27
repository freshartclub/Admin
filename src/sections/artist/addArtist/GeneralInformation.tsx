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

import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  accountId: zod.string().min(1, { message: 'Account Id is required!' }),
  ArtistName: zod.string().min(1, { message: 'ArtistName is required!' }),
  Surnameone: zod.string().min(1, { message: 'ArtistSurname is required!' }),
  Surnametwo: zod.string(),
  ArtworkNickname: zod.string(),
  ArtistId: zod.string().min(1, { message: 'Artist Id is required!' }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  createDate: zod.string(),
  Language: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  Province: zod.string().min(1, { message: 'Province is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  gender: zod.string().min(1, { message: 'Gender is required!' }),
  InternalNote: zod.string(),
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
  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      accountId: artistFormData?.accountId || '',
      ArtistName: artistFormData?.ArtistName || '',
      Surnameone: artistFormData?.Surnameone || '',
      Surnametwo: artistFormData?.Surnametwo || '',
      ArtistId: artistFormData?.ArtistId || '',
      ArtworkNickname: artistFormData?.ArtworkNickname || '',
      country: artistFormData?.country || '',
      zipCode: artistFormData?.zipCode || '',
      city: artistFormData?.city || '',
      Province: artistFormData?.Province || '',
      address: artistFormData?.address || '',
      phoneNumber: artistFormData?.phoneNumber || '',
      email: artistFormData?.email || '',
      Language: artistFormData?.Language || [],
      gender: artistFormData?.gender || '',
      createDate: artistFormData?.createDate || today(),
      InternalNote: artistFormData?.InternalNote || '',
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

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      setValue('accountId', artistFormData?.accountId || '12345');
      setValue('ArtistName', artistFormData?.ArtistName || 'John');
      setValue('Surnameone', artistFormData?.Surnameone || 'Doe');
      setValue('Surnametwo', artistFormData?.Surnametwo || 'Smith');
      setValue('ArtworkNickname', artistFormData?.ArtworkNickname || 'Sunset Bliss');
      setValue('ArtistId', artistFormData?.ArtistId || 'A98765');
      setValue('country', artistFormData?.country || 'USA');
      setValue('createDate', artistFormData?.createDate || new Date().toISOString());
      setValue('Language', artistFormData?.Language || ['English']);
      setValue('zipCode', artistFormData?.zipCode || '90210');
      setValue('city', artistFormData?.city || 'Los Angeles');
      setValue('Province', artistFormData?.Province || 'California');
      setValue('address', artistFormData?.address || '123 Art St.');
      setValue('phoneNumber', artistFormData?.phoneNumber || '+917879610316');
      setValue('email', artistFormData?.email || 'artist@example.com');
      setValue('gender', artistFormData?.gender || 'Men');
      setValue('InternalNote', artistFormData?.InternalNote || 'Mock data for testing');
    }
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    trigger(undefined, { shouldFocus: true });

    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;

      return prev;
    });
  });

  const renderDetails = (
    <Card>
      <CardHeader title="General Informations" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="accountId" label=" Account Id" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="ArtistName" label="Artist name" />

          <Field.Text name="Surnameone" label="Artist Surname 1" />

          <Field.Text name="Surnametwo" label="Artist Surname 2" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="ArtistId" label=" Artist Id" />

          <Field.Text name="ArtworkNickname" label="Artwork Nickname" />
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
          <Field.Text name="Province" label="Province/State/Region" />
        </Box>

        <Field.Text name="address" label="Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Phone name="phoneNumber" label="Phone number" helperText="Good to go" />

          <Field.Text name="email" label="Email address" />
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
            name="Language"
            placeholder="Select Language"
            label="Language"
            options={PRODUCT_LANGUAGE_OPTIONS}
          />

          <Field.SingelSelect
            checkbox
            name="gender"
            label="Gender"
            options={PRODUCT_GENDER_OPTIONS}
          />
        </Box>
        <Field.DatePicker name="createDate" label="Date create" />

        <Field.Text name="InternalNote" label="Internal Note description" multiline rows={4} />
      </Stack>
    </Card>
  );

  return (
    <Form methods={formProps} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {renderDetails}

        <div className="flex justify-end">
          <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
            Save & Next
          </button>
        </div>
      </Stack>
    </Form>
  );
}
