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

import { toast } from 'src/components/snackbar';
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

export function Logistic({ currentProduct, handelNext }) {
  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      LogName: currentProduct?.LogName || '',
      LogisticAddress: currentProduct?.LogisticAddress || '',
      LogZipCode: currentProduct?.LogZipCode || '',
      LogCity: currentProduct?.LogCity || '',
      LogProvince: currentProduct?.LogProvince || '',
      LogCountry: currentProduct?.country || '',
      LogEmail: currentProduct?.LogEmail || '',
      LogphoneNumber: currentProduct?.LogphoneNumber || '',
      LogAdditionalNotes: currentProduct?.LogAdditionalNotes || '',
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

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

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

        {/* end my code */}
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
