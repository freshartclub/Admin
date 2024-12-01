import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContentText, DialogTitle, TableCell, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Papa from 'papaparse';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import {
  PRODUCT_ARTISTPLUS_OPTIONS,
  PRODUCT_CUSTOMORDER_OPTIONS,
  PRODUCT_PICKLIST_OPTIONS,
  PRODUCT_PUBLISHINGCATALOG_OPTIONS,
} from 'src/_mock';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { useSearchParams } from 'src/routes/hooks';
import { z as zod } from 'zod';
import { useGetAllCatalog } from 'src/http/createArtist/useGetAllCatalog';
import { LoadingScreen } from 'src/components/loading-screen';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';

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
  vatAmount: zod.string().min(1, { message: 'Vat Amount is required!' }),
  taxBankName: zod.string().min(1, { message: 'Bank Name is required!' }),
  CustomOrder: zod.string().min(1, { message: 'Custom Order is required!' }),
  PublishingCatalog: zod
    .array(
      zod.object({
        PublishingCatalog: zod.string().min(1, { message: 'Publishing Catalog is required!' }),
        ArtistFees: zod.string().min(1, { message: 'Artist Fee is required!' }),
      })
    )
    .min(1, { message: 'Publishing Catalog is required!' }),
  artistLevel: zod.string().min(1, { message: 'Artist Level is required!' }),
  artProvider: zod.string().min(1, { message: 'Art Provider is required!' }),
  ArtistPlus: zod.string().optional(),
  scoreProfessional: zod.string().optional(),
  scorePlatform: zod.string().optional(),
  MinNumberOfArtwork: zod.number().min(1, { message: 'Min Number of Artwork is required!' }),
  MaxNumberOfArtwork: zod.number().min(1, { message: 'Max Number of Artwork is required!' }),
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
  const [csvData, setCsvData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(false);
  const [code, setCode] = useState('');
  const [selectedBank, setSelectedBank] = useState({ code: '', name: '' });
  const [arr, setArr] = useState<{ value: number; label: number }[]>([]);
  const { data } = useGetAllCatalog();

  useEffect(() => {
    const loadCSV = async () => {
      const response = await fetch('/list-bank.csv');
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setCsvData(result.data);
          setFilteredBanks(result.data);
        },
      });
    };
    loadCSV();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredBanks(csvData);
    } else {
      if (searchQuery !== null) {
        let lookup = searchQuery.toLowerCase();
        const iban = searchQuery.replace(/\s+/g, '');

        if (searchQuery.length >= 8) {
          const countryISO = iban.slice(0, 2).toLowerCase();
          const bankCode = iban.slice(4, 8);
          lookup = `${countryISO}${bankCode}`;
        }
        const filtered = csvData.filter((item: any) =>
          item.EUROPEAN_CODE.toLowerCase().includes(lookup)
        );
        setFilteredBanks(filtered);
      }
    }
  }, [searchQuery, csvData]);

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

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const { isPending, mutate } = useAddArtistMutation(handleSuccess);
  const defaultValues = useMemo(
    () => ({
      taxNumber: artistFormData?.taxNumber || '',
      taxLegalName: artistFormData?.taxLegalName || value ? name(artistFormData) : '',
      taxAddress: artistFormData?.taxAddress || value ? artistFormData?.residentialAddress : '',
      taxZipCode: artistFormData?.taxZipCode || value ? artistFormData?.zipCode : '',
      taxCity: artistFormData?.taxCity || value ? artistFormData?.city : '',
      taxProvince: artistFormData?.taxProvince || value ? artistFormData?.state : '',
      taxCountry: artistFormData?.taxCountry || value ? artistFormData?.country : '',
      taxEmail: artistFormData?.taxEmail || value ? artistFormData?.email : '',
      taxPhone: artistFormData?.taxPhone || value ? artistFormData?.phone : '',
      taxBankIBAN: artistFormData?.taxBankIBAN || '',
      vatAmount: artistFormData?.vatAmount || '',
      taxBankName: artistFormData?.taxBankName || '',
      CustomOrder: artistFormData?.CustomOrder || 'No',
      artistLevel: artistFormData?.artistLevel || '',
      artProvider: artistFormData?.artProvider || 'No',
      PublishingCatalog: artistFormData?.PublishingCatalog || [
        { PublishingCatalog: '', ArtistFees: '' },
      ],
      scoreProfessional: artistFormData?.scoreProfessional || '',
      scorePlatform: artistFormData?.scorePlatform || '',
      ArtistPlus: artistFormData?.ArtistPlus || 'No',
      MinNumberOfArtwork: artistFormData?.MinNumberOfArtwork || '',
      MaxNumberOfArtwork: artistFormData?.MaxNumberOfArtwork || '',
      count: 5,
    }),
    [artistFormData, value]
  );

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { trigger, handleSubmit, reset } = formProps;

  useEffect(() => {
    reset({
      taxLegalName: value ? name(artistFormData) : artistFormData?.taxLegalName,
      taxAddress: value ? artistFormData?.residentialAddress : artistFormData?.taxAddress,
      taxZipCode: value ? artistFormData?.zipCode : artistFormData?.taxZipCode,
      taxCity: value ? artistFormData?.city : artistFormData?.taxCity,
      taxProvince: value ? artistFormData?.state : artistFormData?.taxProvince,
      taxCountry: value ? artistFormData?.country : artistFormData?.taxCountry,
      taxEmail: value ? artistFormData?.email : artistFormData?.taxEmail,
      taxPhone: value ? artistFormData?.phone : artistFormData?.taxPhone,
    });
  }, [value]);

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: 'PublishingCatalog',
  });

  const handleBankSelect = (code, name) => {
    setSelectedBank({ code, name });
    setSearchQuery(null);
    formProps.setValue('taxBankName', name);
    formProps.setValue('taxBankIBAN', searchQuery);
  };

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

  useEffect(() => {
    const tempArr: { value: number; label: number }[] = [];
    for (let i = 0; i <= 99; i++) {
      tempArr.push({ value: i, label: i });
    }
    setArr(tempArr);
  }, []);

  const viewNext = () => {
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
    setTabIndex(tabIndex + 1);
  };

  const filterOptions = (index, fields, data) => {
    const selectedValues = fields.map((field) => field.PublishingCatalog);

    return data.filter(
      (option) =>
        !selectedValues.includes(option.value) || option.value === fields[index]?.PublishingCatalog
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!formProps.getValues('taxLegalName')) {
        setOpen(true);
      }
    }, 1000);

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timeout);
  }, []);

  const copyDialogBox = (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Copy Data</DialogTitle>
      <DialogContent>
        <DialogContentText>Would you like to copy data from General Information?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <span
          onClick={() => {
            setValue(true);
            setOpen(false);
          }}
          className="cursor-pointer text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          Copy Data
        </span>
        <span
          onClick={() => setOpen(false)}
          className="cursor-pointer text-white bg-red-600 rounded-lg px-5 py-2 hover:bg-red-700 font-medium"
        >
          Close
        </span>
      </DialogActions>
    </Dialog>
  );

  const renderDetails = (
    <Card>
      <CardHeader title="Invoicing & Co" sx={{ mb: 2 }} />
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} required name="taxNumber" label=" Tax Number/NIF" />
          <Field.Text disabled={isReadOnly} required name="taxLegalName" label="Tax Legal Name" />
        </Box>
        <Field.Text disabled={isReadOnly} required name="taxAddress" label="Tax Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.CountrySelect
            disabled={isReadOnly}
            required
            setCode={setCode}
            fullWidth
            name="taxCountry"
            label="Tax Country"
            placeholder="Choose a country"
          />
          <Field.Text disabled={isReadOnly} required name="taxZipCode" label="Tax Zip/code" />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} required name="taxCity" label="Tax City" />
          <Field.Text disabled={isReadOnly} required name="taxProvince" label="Tax Province" />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} required name="taxEmail" label="Tax Email address" />
          <Field.Phone
            fetchCode={formProps.getValues('taxPhone') ? null : code ? code : ''}
            disabled={isReadOnly}
            required
            name="taxPhone"
            label="Tax Phone number"
          />
          <Field.Text
            disabled={isReadOnly}
            required
            name="vatAmount"
            placeholder="0.00 %"
            label="Tax VAT amount"
          />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          position="relative"
          height={searchQuery ? '40vh' : 'auto'}
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text
            disabled={isReadOnly}
            required
            value={searchQuery === null ? formProps.getValues('taxBankIBAN') : searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            onClick={() => setFilteredBanks(csvData)}
            autoComplete="off"
            name="taxBankIBAN"
            label="Bank IBAN"
          />
          {searchQuery && (
            <div className="absolute top-16 w-[100%] rounded-lg z-10 h-[30vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto ">
              <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredBanks && filteredBanks.length > 0 ? (
                  filteredBanks.map((bank: any, j) => (
                    <TableCell
                      onClick={() => handleBankSelect(bank.EUROPEAN_CODE, bank.NAME)}
                      key={j}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      {bank.EUROPEAN_CODE} - {bank.NAME}
                    </TableCell>
                  ))
                ) : (
                  <TableCell>No Data Available</TableCell>
                )}
              </TableRow>
            </div>
          )}

          <Field.Text disabled={isReadOnly} required name="taxBankName" label="Bank Name" />
        </Box>
      </Stack>
    </Card>
  );

  const Commercialization = (
    <Card>
      <CardHeader title="Commercialization" sx={{ mb: 2 }} />
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          disabled={isReadOnly}
          required
          checkbox
          name="CustomOrder"
          label="Are you accepting custom Order?"
          options={PRODUCT_CUSTOMORDER_OPTIONS}
        />

        <Stack>
          {data && data.length !== fields.length && (
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
          )}
          <Stack direction={'column'} spacing={2}>
            {fields.map((item, index) => (
              <Box
                key={index}
                columnGap={2}
                rowGap={3}
                display="grid"
                alignItems={'center'}
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 1fr 0.4fr' }}
              >
                <Field.SingelSelect
                  disabled={isReadOnly}
                  required
                  checkbox
                  name={`PublishingCatalog[${index}].PublishingCatalog`}
                  label={`Catalog ${index + 1}`}
                  options={
                    data
                      ? filterOptions(
                          index,
                          fields,
                          data.map((item) => ({ value: item._id, label: item.catalogName }))
                        )
                      : []
                  }
                />
                <Field.Text
                  disabled={isReadOnly}
                  required
                  name={`PublishingCatalog[${index}].ArtistFees`}
                  label="Artist Fees"
                />
                {index > 0 && (
                  <Button
                    disabled={isReadOnly}
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
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
        <Field.Text disabled={isReadOnly} name="scoreProfessional" label="Score Professional" />
        <Field.Text disabled={isReadOnly} name="scorePlatform" label="Score Platform" />
        <Field.SingelSelect
          disabled={isReadOnly}
          required
          checkbox
          name="MinNumberOfArtwork"
          label="Min. Number of artworks"
          options={arr}
        />
        <Field.SingelSelect
          disabled={isReadOnly}
          required
          checkbox
          name="MaxNumberOfArtwork"
          label="Max. Number of artworks"
          options={arr}
        />
      </Stack>
    </Card>
  );

  return (
    <Form methods={formProps} onSubmit={onSubmit}>
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
      {copyDialogBox}
    </Form>
  );
}
