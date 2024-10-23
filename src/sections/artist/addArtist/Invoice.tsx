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
import { useRouter, useSearchParams } from 'src/routes/hooks';
import {
  PRODUCT_ARTISTPLUS_OPTIONS,
  PRODUCT_CUSTOMORDER_OPTIONS,
  PRODUCT_PUBLISHINGCATALOG_OPTIONS,
  PRODUCT_MINNUMBROFARTWORK_OPTIONS,
  PRODUCT_MAXNUMBROFARTWORK_OPTIONS,
  PRODUCT_PICKLIST_OPTIONS,
} from 'src/_mock';
import { Iconify } from 'src/components/iconify';
import { Field, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';

export const NewProductSchema = zod.object({
  taxNumber: zod.string().min(1, { message: 'taxNumber/NIF Id is required!' }),
  taxLegalName: zod.string().min(1, { message: 'taxLegalName is required!' }),
  taxAddress: zod.string().min(1, { message: 'Tax Address is required!' }),
  taxZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  taxCity: zod.string().min(1, { message: 'Tax City is required!' }),
  taxProvince: zod.string().min(1, { message: 'Tax Province is required!' }),
  taxCountry: schemaHelper.objectOrNull({
    message: { required_error: 'Tax Country is required!' },
  }),
  taxEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  taxPhone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  taxBankIBAN: zod.string(),
  taxBankName: zod.string().min(1, { message: 'Bank Name is required!' }),
  CustomOrder: zod.string().min(1, { message: 'Custom Order is required!' }),
  PublishingCatalog: zod.array(
    zod.object({
      PublishingCatalog: zod.string().min(1, { message: 'Publishing Catalog is required!' }),
      ArtistFees: zod.string().min(1, { message: 'Artist Fee is required!' }),
    })
  ),
  artistLevel: zod.string().min(1, { message: 'Artist Level is required!' }),
  artProvider: zod.string().min(1, { message: 'Art Provider is required!' }),
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
  const [ibanNumber, setIbanNumber] = useState('');
  const [includeTaxes, setIncludeTaxes] = useState(false);

  const view = useSearchParams().get('view');
  const isReadOnly = view !== null;

  const handleSuccess = (data) => {
    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
  };

  const { isPending, mutate } = useAddArtistMutation(handleSuccess);
  const defaultValues = useMemo(() => {
    const def = {
      taxNumber: artistFormData?.taxNumber || '',
      taxLegalName: artistFormData?.taxLegalName || '',
      taxAddress: artistFormData?.taxAddress || '',
      taxZipCode: artistFormData?.taxZipCode || '',
      taxCity: artistFormData?.taxCity || '',
      taxProvince: artistFormData?.taxProvince || '',
      taxCountry: artistFormData?.taxCountry || '',
      taxEmail: artistFormData?.taxEmail || '',
      taxPhone: artistFormData?.taxPhone || '',
      taxBankIBAN: artistFormData?.taxBankIBAN || '',
      taxBankName: artistFormData?.taxBankName || '',
      CustomOrder: artistFormData?.CustomOrder || '',
      artistLevel: artistFormData?.artistLevel || '',
      artProvider: artistFormData?.artProvider || '',
      PublishingCatalog: artistFormData?.PublishingCatalog || '',
      ArtistPlus: artistFormData?.ArtistPlus || '',
      MinNumberOfArtwork: artistFormData?.MinNumberOfArtwork || '',
      MaxNumberOfArtwork: artistFormData?.MaxNumberOfArtwork || '',
      count: 5,
    };
    setIbanNumber(artistFormData?.taxBankIBAN);
    return def;
  }, [artistFormData]);

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { trigger, handleSubmit } = formProps;

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: 'PublishingCatalog',
  });

  const handleRemove = (index) => {
    remove(index);
  };
  const addCatelog = () => {
    append({ PublishingCatalog: '' });
  };

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });

    data.count = 5;

    mutate({ body: data });
  });

  const hanldeIbanChange = (e) => {
    let ibanDetail: ExtractIBANResult;
    const val = e.target.value;
    const { valid } = validateIBAN(val);
    if (!valid) {
      formProps.setError('taxBankIBAN', {
        message: 'Please enter a valid IBAN number',
      });
    } else {
      ibanDetail = extractIBAN(val);
      formProps.clearErrors('taxBankIBAN');
      formProps.setValue('taxBankIBAN', val);

      formProps.setValue('taxBankName', ibanDetail.bankIdentifier);
    }

    setIbanNumber(val);
  };

  const viewNext = () => {
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
    setTabIndex(tabIndex + 1);
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
          <Field.Text disabled={isReadOnly} required name="taxNumber" label=" taxNumber/NIF" />

          <Field.Text disabled={isReadOnly} required name="taxLegalName" label="taxLegalName" />
        </Box>

        <Field.Text disabled={isReadOnly} required name="taxAddress" label="Tax Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} required name="taxZipCode" label="Tax Zip/code" />

          <Field.Text disabled={isReadOnly} required name="taxCity" label="Tax City" />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} required name="taxProvince" label="taxProvince" />

          <Field.CountrySelect
            disabled={isReadOnly}
            required
            fullWidth
            name="taxCountry"
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
          <Field.Text disabled={isReadOnly} required name="taxEmail" label="Tax Email address" />

          <Field.Phone disabled={isReadOnly} required name="taxPhone" label="Tax Phone number" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text
            disabled={isReadOnly}
            required
            onChange={hanldeIbanChange}
            value={ibanNumber}
            name="taxBankIBAN"
            label="Bank IBAN"
          />

          <Field.Text disabled={isReadOnly} required name="taxBankName" label="taxBankName" />
        </Box>
      </Stack>
    </Card>
  );

  const Commercialization = (
    <Card>
      <CardHeader title="Commercialization" sx={{ mb: 1 }} />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          disabled={isReadOnly}
          required
          checkbox
          name="CustomOrder"
          label="Are you accept custom Order?"
          options={PRODUCT_CUSTOMORDER_OPTIONS}
        />

        <Stack>
          <div className="flex justify-end">
            <Button
              disabled={isReadOnly}
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addCatelog}
            >
              {fields.length === 0 ? 'Add Catalog' : 'Add More Catelog'}
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
                  disabled={isReadOnly}
                  required
                  checkbox
                  name={`PublishingCatalog[${index}].PublishingCatalog`}
                  label="publishing catalogue"
                  options={PRODUCT_PUBLISHINGCATALOG_OPTIONS}
                />
                <Field.Text
                  disabled={isReadOnly}
                  required
                  name={`PublishingCatalog[${index}].ArtistFees`}
                  label=" Artist Fees"
                />
              </Box>

              <Button
                disabled={isReadOnly}
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

        <Field.SingelSelect
          disabled={isReadOnly}
          required
          checkbox
          name="artistLevel"
          label="Artist Level"
          options={PRODUCT_PICKLIST_OPTIONS}
        />

        <Field.SingelSelect
          disabled={isReadOnly}
          required
          checkbox
          name="artProvider"
          label="Is Art Provider"
          options={PRODUCT_CUSTOMORDER_OPTIONS}
        />

        <Field.SingelSelect
          disabled={isReadOnly}
          checkbox
          name="ArtistPlus"
          label="Artist +++"
          options={PRODUCT_ARTISTPLUS_OPTIONS}
        />
        <Field.SingelSelect
          disabled={isReadOnly}
          required
          checkbox
          name="MinNumberOfArtwork"
          label="Min. Number of artworks"
          options={PRODUCT_MINNUMBROFARTWORK_OPTIONS}
        />
        <Field.SingelSelect
          disabled={isReadOnly}
          required
          checkbox
          name="MaxNumberOfArtwork"
          label="Max. Number of artworks"
          options={PRODUCT_MAXNUMBROFARTWORK_OPTIONS}
        />
      </Stack>
    </Card>
  );

  return (
    <FormProvider {...formProps}>
      <form onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          {renderDetails}

          {Commercialization}

          <div className="flex justify-end">
            {!isReadOnly ? (
              <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
                {isPending ? 'Loading...' : 'Save & Next'}
              </button>
            ) : (
              <span
                onClick={viewNext}
                className="text-white bg-black rounded-md px-3 py-2 cursor-pointer"
              >
                View Next
              </span>
            )}
          </div>
        </Stack>
      </form>
    </FormProvider>
  );
}
