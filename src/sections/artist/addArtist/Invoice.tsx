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
      PublishingCatalog: artistFormData?.PublishingCatalog || '',
      ArtistFees: artistFormData?.ArtistFees || '',
      ArtistPlus: artistFormData?.ArtistPlus || '',
      MinNumberOfArtwork: artistFormData?.MinNumberOfArtwork || '',
      MaxNumberOfArtwork: artistFormData?.MaxNumberOfArtwork || '',
    };
    setIbanNumber(artistFormData?.taxBankIBAN);
    return def;
  }, [artistFormData]);

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
    append({ PublishingCatalog: '' });
  };
  //     setValue('taxNumber', artistFormData?.taxNumber || '12345');
  //     setValue('taxLegalName', artistFormData?.taxLegalName || 'John Doe');
  //     setValue('taxAddress', artistFormData?.taxAddress || '31,c21,vijay nager');
  //     setValue('taxZipCode', artistFormData?.taxZipCode || '12345');
  //     setValue('TaxCity', artistFormData?.TaxCity || 'Indore');
  //     setValue('taxProvince', artistFormData?.taxProvince || 'Madhay Pradesh');
  //     setValue('taxCountry', artistFormData?.taxCountry || 'USA');
  //     setValue('taxEmail', artistFormData?.taxEmail || 'JohnDoe@gmail.com');
  //     setValue('taxPhone', artistFormData?.taxPhone || '+917879610316');
  //     setValue('taxBankIBAN', artistFormData?.taxBankIBAN || 'CBI90210');
  //     setValue('taxBankName', artistFormData?.taxBankName || 'Bank of America');
  //     setValue('CustomOrder', artistFormData?.CustomOrder || 'Yes');
  //     // setValue('PublishingCatalog', artistFormData?.PublishingCatalog || 'Catagog 1');
  //     if (artistFormData?.catagoryone?.length) {
  //       setValue('PublishingCatalog', artistFormData.PublishingCatalog);
  //     } else {
  //       const mockData = [
  //         {
  //           PublishingCatalog: 'Catagog 4',
  //         },
  //       ];

  //       mockData.forEach((item) => append(item));
  //     }
  //     setValue('ArtistFees', artistFormData?.ArtistFees || '10000');
  //     setValue('ArtistPlus', artistFormData?.ArtistPlus || 'Yes');
  //     setValue('MinNumberOfArtwork', artistFormData?.MinNumberOfArtwork || '9');
  //     setValue('MaxNumberOfArtwork', artistFormData?.MaxNumberOfArtwork || '13');
  //   }
  // }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
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
          <Field.Text disabled={isReadOnly} name="taxNumber" label=" taxNumber/NIF" />

          <Field.Text disabled={isReadOnly} name="taxLegalName" label="taxLegalName" />
        </Box>

        <Field.Text disabled={isReadOnly} name="taxAddress" label="Tax Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} name="taxZipCode" label="Tax Zip/code" />

          <Field.Text disabled={isReadOnly} name="taxCity" label="Tax City" />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} name="taxProvince" label="taxProvince" />

          <Field.CountrySelect
            disabled={isReadOnly}
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
          <Field.Text disabled={isReadOnly} name="taxEmail" label="Tax Email address" />

          <Field.Phone disabled={isReadOnly} name="taxPhone" label="Tax Phone number" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text
            disabled={isReadOnly}
            onChange={hanldeIbanChange}
            value={ibanNumber}
            name="taxBankIBAN"
            label="Bank IBAN"
          />

          <Field.Text disabled={isReadOnly} name="taxBankName" label="taxBankName" />
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
          disabled={isReadOnly}
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
              disabled={isReadOnly}
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
                  disabled={isReadOnly}
                  checkbox
                  name={`PublishingCatalog[${index}].PublishingCatalog`}
                  label="publishing catalogue"
                  options={PRODUCT_PUBLISHINGCATALOG_OPTIONS}
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
        {/* try end */}
        <Field.Text disabled={isReadOnly} name="ArtistFees" label=" Artist Fees" />

        <Field.SingelSelect
          disabled={isReadOnly}
          checkbox
          name="ArtistPlus"
          label="Artist +++"
          options={PRODUCT_ARTISTPLUS_OPTIONS}
        />
        <Field.SingelSelect
          disabled={isReadOnly}
          checkbox
          name="MinNumberOfArtwork"
          label="Min. Number of artworks"
          options={PRODUCT_MINNUMBROFARTWORK_OPTIONS}
        />
        <Field.SingelSelect
          disabled={isReadOnly}
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
