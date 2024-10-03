import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { useRouter } from 'src/routes/hooks';

import { PRODUCT_GENDER_OPTIONS, PRODUCT_LANGUAGE_OPTIONS } from 'src/_mock';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  ManagerartistName: zod.string().min(1, { message: 'artistName is required!' }),
  ManagerartistSurname1: zod.string().min(1, { message: 'ArtistSurname is required!' }),
  ManagerartistSurname2: zod.string(),
  ManagerArtworkNickname: zod.string(),
  ContactTo: zod.string(),
  ManagerphoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  ManagerEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  ManagerAddress: zod.string().min(1, { message: 'Address is required!' }),
  ManagerZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  ManagerCity: zod.string().min(1, { message: 'City is required!' }),
  ManagerProvince: zod.string().min(1, { message: 'Province is required!' }),
  ManagerCountry: zod.string().min(1, { message: 'Country is required!' }),
  ManagerLanguage: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  ManagerGender: zod.string().min(1, { message: 'Gender is required!' }),
  ManagerExtraInfo01: zod.string(),
  ManagerExtraInfo02: zod.string(),
  ManagerExtraInfo03: zod.string(),
  ManagerDocumentName: zod.string().min(1, { message: 'Document Name is required!' }),
  document: schemaHelper.file({ message: { required_error: 'document is required!' } }),
});

// ----------------------------------------------------------------------

export function OtherDetails({
  artistFormData,
  setArtistFormData,
  setTabState,
  setTabIndex,
  tabIndex,
  tabState,
}: AddArtistComponentProps) {
  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      ManagerartistName: artistFormData?.ManagerartistName || '',
      ManagerartistSurname1: artistFormData?.ManagerartistSurname1 || '',
      ManagerartistSurname2: artistFormData?.ManagerartistSurname2 || '',
      ManagerArtworkNickname: artistFormData?.ManagerArtworkNickname || '',
      ContactTo: artistFormData?.ContactTo || '',
      ManagerphoneNumber: artistFormData?.ManagerphoneNumber || '',
      ManagerEmail: artistFormData?.ManagerEmail || '',
      ManagerAddress: artistFormData?.ManagerAddress || '',
      ManagerZipCode: artistFormData?.ManagerZipCode || '',
      ManagerCity: artistFormData?.ManagerCity || '',
      ManagerProvince: artistFormData?.ManagerProvince || '',
      ManagerCountry: artistFormData?.ManagerCountry || '',
      ManagerLanguage: artistFormData?.ManagerLanguage || [],
      ManagerGender: artistFormData?.ManagerGender || '',
      ManagerExtraInfo01: artistFormData?.ManagerExtraInfo01 || '',
      ManagerExtraInfo02: artistFormData?.ManagerExtraInfo02 || '',
      ManagerExtraInfo03: artistFormData?.ManagerExtraInfo03 || '',
      ManagerDocumentName: artistFormData?.ManagerDocumentName || '',
      document: artistFormData?.document || null,
    }),
    [artistFormData]
  );

  const handleRemoveDocument = () => {
    setValue('document', null);
  };

  const methods = useForm({
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
  } = methods;

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      setValue('ManagerartistName', artistFormData?.ManagerartistName || 'John ');
      setValue('ManagerartistSurname1', artistFormData?.ManagerartistSurname1 || 'Doe');
      setValue('ManagerartistSurname2', artistFormData?.ManagerartistSurname2 || 'Smith');
      setValue('ManagerArtworkNickname', artistFormData?.ManagerArtworkNickname || 'Sunset Bliss');
      setValue('ContactTo', artistFormData?.ContactTo || 'Sandy');
      setValue('ManagerphoneNumber', artistFormData?.ManagerphoneNumber || '+919165326598');
      setValue('ManagerEmail', artistFormData?.ManagerEmail || 'JohnDoe@gmail.com');

      setValue('ManagerAddress', artistFormData?.ManagerAddress || '131 chanda Nager');
      setValue('ManagerZipCode', artistFormData?.ManagerZipCode || '12345');
      setValue('ManagerCity', artistFormData?.ManagerCity || 'Los Angeles');
      setValue('ManagerProvince', artistFormData?.ManagerProvince || 'Alaska');
      setValue('ManagerCountry', artistFormData?.ManagerCountry || ' Albania');
      setValue('ManagerLanguage', artistFormData?.ManagerLanguage || ['English']);
      setValue('ManagerGender', artistFormData?.ManagerGender || 'Men');
    }
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    trigger(undefined, { shouldFocus: true });
    setArtistFormData({ ...artistFormData, ...data });
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;

      return prev;
    });
  });

  const document = (
    <Card>
      <CardHeader title="Document" sx={{ mb: 1 }} />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="ManagerDocumentName" label="Documents name" />

        <div>
          <Typography variant="Document">Upload Document</Typography>
          <Field.UploadDocument name="document" maxSize={3145728} onDelete={handleRemoveDocument} />
        </div>
      </Stack>
    </Card>
  );
  const renderDetails = (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Manager Details (If any)" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="ManagerartistName" label="Artist name" />

          <Field.Text name="ManagerartistSurname1" label="Artist Surname 1" />

          <Field.Text name="ManagerartistSurname2" label="Artist Surname 2" />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="ManagerArtworkNickname" label="Artwork Nickname" />

          <Field.Text name="ContactTo" label="Contact To" />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Phone name="ManagerphoneNumber" label="Phone number" />

          <Field.Text name="ManagerEmail" label="Email address" />
        </Box>

        <Field.Text name="ManagerAddress" label="Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          <Field.Text name="ManagerZipCode" label="Zip/code" />
          <Field.Text name="ManagerCity" label="City" />
          <Field.Text name="ManagerProvince" label="Province/State/Region" />
          {/* <Field.Text name="ManagerCountry" label="Country" /> */}
          <Field.CountrySelect
            fullWidth
            name="ManagerCountry"
            label="Country"
            placeholder="Choose a country"
          />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.MultiSelect
            checkbox
            name="ManagerLanguage"
            label="Language"
            options={PRODUCT_LANGUAGE_OPTIONS}
          />

          <Field.SingelSelect
            checkbox
            name="ManagerGender"
            label="Gender"
            options={PRODUCT_GENDER_OPTIONS}
          />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="ManagerExtraInfo01" label="Extra Info 01" />
          <Field.Text name="ManagerExtraInfo01" label="Extra Info 02" />
          <Field.Text name="ManagerExtraInfo01" label="Extra Info 03" />
        </Box>
        {/* end section */}
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {document}

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
