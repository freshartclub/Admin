import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect,useCallback } from 'react';
import { Typography } from '@mui/material';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { useRouter } from 'src/routes/hooks';

import { PRODUCT_GENDER_OPTIONS, PRODUCT_LANGUAGE_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  ManagerArtistName: zod.string().min(1, { message: 'ArtistName is required!' }),
  ManagerSurnameone: zod.string().min(1, { message: 'ArtistSurname is required!' }),
  ManagerSurnametwo: zod.string(),
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
  ManagerExtraInfo01:zod.string(),
  ManagerExtraInfo02: zod.string(),
  ManagerExtraInfo03: zod.string(),
  ManagerDocumentName:zod.string().min(1, { message: 'Document Name is required!' }),
  document:schemaHelper.file({ message: { required_error: 'document is required!' } }),
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
      ManagerArtistName: artistFormData?.ManagerArtistName || '',
      ManagerSurnameone: artistFormData?.ManagerSurnameone || '',
      ManagerSurnametwo: artistFormData?.ManagerSurnametwo || '',
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
      document:artistFormData?.document || null,
      
    }),
    [artistFormData]
  );

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

  const handleRemoveFile = useCallback(() => {
    setValue('document', null);
  }, [setValue]);

  useEffect(() => {
    if (window.location.hostname === 'localhost' && window.location.port === '5173') {
      setValue('ManagerArtistName', artistFormData?.ManagerArtistName || 'John ');
      setValue('ManagerSurnameone', artistFormData?.ManagerSurnameone || 'Doe');
      setValue('ManagerSurnametwo', artistFormData?.ManagerSurnametwo || 'Smith');
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
            <Field.UploadBox name="document" maxSize={3145728} onDelete={handleRemoveFile} />

          </div>
      </Stack>
    </Card>
  );
  const renderDetails = (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        title="Manager Details (If any)"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="ManagerArtistName" label="Artist name" />

          <Field.Text name="ManagerSurnameone" label="Artist Surname 1" />

          <Field.Text name="ManagerSurnametwo" label="Artist Surname 2" />
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
