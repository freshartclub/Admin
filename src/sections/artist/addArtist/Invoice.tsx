import type { ExtractIBANResult } from 'ibantools';
import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { extractIBAN, validateIBAN } from 'ibantools';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import {
  PRODUCT_ARTISTPLUS_OPTIONS,
  PRODUCT_CUSTOMORDER_OPTIONS,
  PRODUCT_PUBLISHINGCATALOG_OPTIONS,
  PRODUCT_MINNUMBROFARTWORK_OPTIONS,
  PRODUCT_MAXNUMBROFARTWORK_OPTIONS,
} from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { Field, schemaHelper } from 'src/components/hook-form';

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
  // PublishingCatalog: zod.string().min(1, { message: 'Publishing Catalog is required!' }),
  PublishingCatalog: zod.array(
    zod.object({
      PublishingCatalog: zod.string().min(1, { message: 'Publishing Catalog is required!' }),
    })
  ),
  ArtistFees: zod.string().min(1, { message: 'Artist Fees is required!' }),
  ArtistPlus: zod.string(),
  MinNumberOfArtwork: zod.string().min(1, { message: 'Min Number of Artwork is required!' }),
  MaxNumberOfArtwork: zod.string().min(1, { message: 'Max Number of Artwork is required!' }),
});

// ----------------------------------------------------------------------

export function Invoice({
  artistFormData,
  setArtistFormData,
  setTabState,
  setTabIndex,
  tabIndex,
  tabState,
}: AddArtistComponentProps) {
  const router = useRouter();
  const [ibanNumber, setIbanNumber] = useState('');
  const [bankName, setBankName] = useState('');

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      TaxNumber: artistFormData?.TaxNumber || '',
      TaxLegalName: artistFormData?.TaxLegalName || '',
      TaxAddress: artistFormData?.TaxAddress || '',
      TaxZipCode: artistFormData?.zipCode || '',
      TaxCity: artistFormData?.city || '',
      TaxProvince: artistFormData?.TaxProvince || '',
      TaxCountry: artistFormData?.TaxCountry || '',
      TaxEmail: artistFormData?.TaxEmail || '',
      TaxPhone: artistFormData?.TaxPhone || '',
      BankIBAN: artistFormData?.BankIBAN || '',
      BankName: artistFormData?.BankName || '',
      CustomOrder: artistFormData?.CustomOrder || '',
      PublishingCatalog: artistFormData?.PublishingCatalog || '',
      ArtistFees: artistFormData?.ArtistFees || '',
      ArtistPlus: artistFormData?.ArtistPlus || '',
      MinNumberOfArtwork: artistFormData?.MinNumberOfArtwork || '',
      MaxNumberOfArtwork: artistFormData?.MaxNumberOfArtwork || '',
    }),
    [artistFormData]
  );

  // const methods = useForm({
  //   resolver: zodResolver(NewProductSchema),
  //   defaultValues,
  // });
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
  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: 'PublishingCatalog',
  });

  const handleRemove = (index) => {
    remove(index);
  };
  const addCatelog = () => {
    append({
      PublishingCatalog: '',
    });
  };
  useEffect(() => {
    if (window.location.hostname === 'localhost' && window.location.port === '5173') {
      setValue('TaxNumber', artistFormData?.TaxNumber || '12345');
      setValue('TaxLegalName', artistFormData?.TaxLegalName || 'John Doe');
      setValue('TaxAddress', artistFormData?.TaxAddress || '31,c21,vijay nager');
      setValue('TaxZipCode', artistFormData?.TaxZipCode || '12345');
      setValue('TaxCity', artistFormData?.TaxCity || 'Indore');
      setValue('TaxProvince', artistFormData?.TaxProvince || 'Madhay Pradesh');
      setValue('TaxCountry', artistFormData?.TaxCountry || 'USA');
      setValue('TaxEmail', artistFormData?.TaxEmail || 'JohnDoe@gmail.com');
      setValue('TaxPhone', artistFormData?.TaxPhone || '+917879610316');
      setValue('BankIBAN', artistFormData?.BankIBAN || 'CBI90210');
      setValue('BankName', artistFormData?.BankName || 'Bank of America');
      setValue('CustomOrder', artistFormData?.CustomOrder || 'Yes');
      // setValue('PublishingCatalog', artistFormData?.PublishingCatalog || 'Catagog 1');
      if (artistFormData?.catagoryone?.length) {
        setValue('PublishingCatalog', artistFormData.PublishingCatalog);
      } else {
        const mockData = [
          {
            PublishingCatalog: 'Catagog 4',
          },
        ];

        mockData.forEach((item) => append(item));
      }
      setValue('ArtistFees', artistFormData?.ArtistFees || '10000');
      setValue('ArtistPlus', artistFormData?.ArtistPlus || 'Yes');
      setValue('MinNumberOfArtwork', artistFormData?.MinNumberOfArtwork || '9');
      setValue('MaxNumberOfArtwork', artistFormData?.MaxNumberOfArtwork || '13');
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

  const hanldeIbanChange = (e) => {
    let ibanDetail: ExtractIBANResult;
    const val = e.target.value;
    const { valid } = validateIBAN(val);
    if (!valid) {
      formProps.setError('BankIBAN', {
        message: 'Please enter a valid IBAN number',
      });
    } else {
      ibanDetail = extractIBAN(val);
      formProps.clearErrors('BankIBAN');
      console.log(ibanDetail);

      formProps.setValue('BankName', ibanDetail.bankIdentifier);
    }

    setIbanNumber(val);
  };

  const renderDetails = (
    <Card>
      <CardHeader title="Invoicing & Co" sx={{ mb: 3 }} />

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
          <Field.Text
            onChange={hanldeIbanChange}
            value={ibanNumber}
            name="BankIBAN"
            label="Bank IBAN"
          />

          <Field.Text name="BankName" label="BankName" />
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
        {/* <Field.SingelSelect
          checkbox
          name="PublishingCatalog"
          label="publishing catalogue"
          options={PRODUCT_PUBLISHINGCATALOG_OPTIONS}
        /> */}
        {/* try start */}
        <Stack>
          <div className="flex justify-end">
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addCatelog}
            >
              Add More Catelog
            </Button>
          </div>
          {fields.map((item, index) => (
            <Stack
              key={item.id}
              aligncvs={{ xs: 'flex-center', md: 'flex-end' }}
              spacing={1.5}
              className=""
            >
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
              >
                <Field.SingelSelect
                  checkbox
                  name={`PublishingCatalog[${index}].PublishingCatalog`}
                  label="publishing catalogue"
                  options={PRODUCT_PUBLISHINGCATALOG_OPTIONS}
                />
              </Box>

              <Button
                size="small"
                color="error"
                className="flex justify-end"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </Stack>
          ))}
        </Stack>
        {/* try end */}
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
        {!artistFormData ? 'Create product' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider {...formProps}>
      <form onSubmit={onSubmit}>
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
      </form>
    </FormProvider>
  );
}
