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

import {
  PRODUCT_BANKNAME_OPTIONS,
  PRODUCT_ARTISTPLUS_OPTIONS,
  PRODUCT_CUSTOMORDER_OPTIONS,
  PRODUCT_PUBLISHINGCATALOG_OPTIONS,
  PRODUCT_MINNUMBROFARTWORK_OPTIONS,
  PRODUCT_MAXNUMBROFARTWORK_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  TaxNumber: zod.string().min(1, { message: 'TaxNumber/NIF Id is required!' }),
  TaxLegalName: zod.string().min(1, { message: 'TaxLegalName is required!' }),
  TaxAddress: zod.string().min(1, { message: 'Tax Address is required!' }),
  TaxZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  TaxCity: zod.string().min(1, { message: 'Tax City is required!' }),
  TaxProvince: zod.string().min(1, { message: 'Tax Province is required!' }),
  TaxCountry: schemaHelper.objectOrNull({
    message: { required_error: 'Tax Country is required!' },
  }),
  TaxEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  TaxPhone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  BankIBAN: zod.string().min(1, { message: 'Bank IBAN is required!' }),
  BankName: zod.string().min(1, { message: 'Bank Name is required!' }),
  CustomOrder: zod.string().min(1, { message: 'Custom Order is required!' }),
  PublishingCatalog: zod.string().min(1, { message: 'Publishing Catalog is required!' }),
  ArtistFees: zod.string().min(1, { message: 'Artist Fees is required!' }),
  ArtistPlus: zod.string(),
  MinNumberOfArtwork: zod.string().min(1, { message: 'Min Number of Artwork is required!' }),
  MaxNumberOfArtwork: zod.string().min(1, { message: 'Max Number of Artwork is required!' }),
});

// ----------------------------------------------------------------------

export function Invoice({ currentProduct, handelNext }) {
  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      TaxNumber: currentProduct?.TaxNumber || '',
      TaxLegalName: currentProduct?.TaxLegalName || '',
      TaxAddress: currentProduct?.TextAddress || '',
      TaxZipCode: currentProduct?.zipCode || '',
      TaxCity: currentProduct?.city || '',
      TaxProvince: currentProduct?.TaxProvince || '',
      TaxCountry: currentProduct?.TaxCountry || '',
      TaxEmail: currentProduct?.TaxEmail || '',
      TaxPhone: currentProduct?.TaxPhone || '',
      BankIBAN: currentProduct?.BankIBAN || '',
      BankName: currentProduct?.BankName || '',
      CustomOrder: currentProduct?.CustomOrder || '',
      PublishingCatalog: currentProduct?.PublishingCatalog || '',
      ArtistFees: currentProduct?.ArtistFees || '',
      ArtistPlus: currentProduct?.ArtistPlus || '',
      MinNumberOfArtwork: currentProduct?.MinNumberOfArtwork || '',
      MaxNumberOfArtwork: currentProduct?.MaxNumberOfArtwork || '',
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
      <CardHeader title="Invoicing" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="TaxNumber" label=" TaxNumber/NIF" />

          <Field.Text name="TaxLegalName" label="TaxLegalName" />
        </Box>

        <Field.Text name="TaxAddress" label="Tax Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="TaxZipCode" label="Tax Zip/code" />

          <Field.Text name="TaxCity" label="Tax City" />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="TaxProvince" label="TaxProvince" />

          <Field.CountrySelect
            fullWidth
            name="TaxCountry"
            label="Tax Country"
            placeholder="Choose a country"
          />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="TaxEmail" label="Tax Email address" />

          <Field.Phone name="TaxPhone" label="Tax Phone number" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="BankIBAN" label="Bank IBAN" />

          <Field.SingelSelect
            checkbox
            name="BankName"
            label="Bank Name "
            options={PRODUCT_BANKNAME_OPTIONS}
          />
        </Box>

        {/* end my section */}
      </Stack>
    </Card>
  );

  const Commercialization = (
    <Card>
      <CardHeader title="Commercialization" sx={{ mb: 1 }} />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="CustomOrder"
          label="Are you accept custom Order?"
          options={PRODUCT_CUSTOMORDER_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="PublishingCatalog"
          label="publishing catalogue"
          options={PRODUCT_PUBLISHINGCATALOG_OPTIONS}
        />
        <Field.Text name="ArtistFees" label=" Artist Fees" />

        <Field.SingelSelect
          checkbox
          name="ArtistPlus"
          label="Artist +++"
          options={PRODUCT_ARTISTPLUS_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="MinNumberOfArtwork"
          label="Min. Number of artworks"
          options={PRODUCT_MINNUMBROFARTWORK_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="MaxNumberOfArtwork"
          label="Max. Number of artworks"
          options={PRODUCT_MAXNUMBROFARTWORK_OPTIONS}
        />
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

        {Commercialization}
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
