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

import { useRouter } from 'src/routes/hooks';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  LogName: zod.string().min(1, { message: 'LogName is required!' }),
  LogisticAddress: zod.string().min(1, { message: 'Logistic Address is required!' }),
  LogZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  LogCity: zod.string().min(1, { message: 'City is required!' }),
  LogProvince: zod.string().min(1, { message: 'Province is required!' }),
  LogCountry: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  LogEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  LogphoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  LogAdditionalNotes: zod.string(),
});

// ----------------------------------------------------------------------

export function Logistic({
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
      LogName: artistFormData?.LogName || '',
      LogisticAddress: artistFormData?.LogisticAddress || '',
      LogZipCode: artistFormData?.LogZipCode || '',
      LogCity: artistFormData?.LogCity || '',
      LogProvince: artistFormData?.LogProvince || '',
      LogCountry: artistFormData?.country || '',
      LogEmail: artistFormData?.LogEmail || '',
      LogphoneNumber: artistFormData?.LogphoneNumber || '',
      LogAdditionalNotes: artistFormData?.LogAdditionalNotes || '',
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

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      setValue('LogName', artistFormData?.LogName || 'John');
      setValue('LogisticAddress', artistFormData?.LogisticAddress || '121 c21 vijay nager');
      setValue('LogZipCode', artistFormData?.LogZipCode || '12345');
      setValue('LogCity', artistFormData?.LogCity || 'Indore');
      setValue('LogProvince', artistFormData?.LogProvince || 'Madhay Pradesh');
      setValue('LogCountry', artistFormData?.LogCountry || 'USA');

      setValue('LogEmail', artistFormData?.LogEmail || 'Artist@gmail.com');
      setValue('LogphoneNumber', artistFormData?.LogphoneNumber || '+919165323561');
      setValue(
        'LogAdditionalNotes',
        artistFormData?.LogAdditionalNotes || 'Hi this is testing Data Additional Notes '
      );
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
      <CardHeader title="Logistics" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="LogName" label="Log name" />

        <Field.Text name="LogisticAddress" label="Logistic Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="LogZipCode" label="Log Zip/code" />

          <Field.Text name="LogCity" label=" Log City" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="LogProvince" label="Log Province/State/Region" />

          <Field.CountrySelect
            fullWidth
            name="LogCountry"
            label="Log Country"
            placeholder="Choose a country"
          />

          <Field.Text name="LogEmail" label="Email address" />

          <Field.Phone name="LogphoneNumber" label="Log Phone number" />
        </Box>

        <Field.Text name="LogAdditionalNotes" label="Log Additional Notes" multiline rows={4} />
      </Stack>
    </Card>
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
