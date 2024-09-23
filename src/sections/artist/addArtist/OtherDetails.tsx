import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

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
});

// ----------------------------------------------------------------------

export function OtherDetails({ currentProduct, handelNext }) {
  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      ManagerArtistName: currentProduct?.ManagerArtistName || '',
      ManagerSurnameone: currentProduct?.ManagerSurnameone || '',
      ManagerSurnametwo: currentProduct?.ManagerSurnametwo || '',
      ManagerArtworkNickname: currentProduct?.ManagerArtworkNickname || '',
      ContactTo: currentProduct?.ContactTo || '',
      ManagerphoneNumber: currentProduct?.ManagerphoneNumber || '',
      ManagerEmail: currentProduct?.ManagerEmail || '',
      ManagerAddress: currentProduct?.ManagerAddress || '',
      ManagerZipCode: currentProduct?.ManagerZipCode || '',
      ManagerCity: currentProduct?.ManagerCity || '',
      ManagerProvince: currentProduct?.ManagerProvince || '',
      ManagerCountry: currentProduct?.ManagerCountry || '',
      ManagerLanguage: currentProduct?.ManagerLanguage || [],
      ManagerGender: currentProduct?.ManagerGender || '',
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      console.info('DATA', data);
      handelNext();
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = (
    <Card>
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
          <Field.Text name="ManagerCountry" label="Country" />
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
        {/* end section */}
        
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create product' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {renderDetails}

        {/* {renderActions} */}
        <div className="flex justify-end">
          <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
            Save & Next
          </button>
        </div>
      </Stack>
    </Form>
  );
}
