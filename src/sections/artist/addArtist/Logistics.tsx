import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import { useSearchParams } from 'src/routes/hooks';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { Dialog, DialogActions } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  logName: zod.string().min(1, { message: 'LogName is required!' }),
  logAddress: zod.string().min(1, { message: 'Logistic Address is required!' }),
  logZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  logCity: zod.string().min(1, { message: 'City is required!' }),
  logProvince: zod.string().min(1, { message: 'Province is required!' }),
  logCountry: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  logEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  logPhone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  logNotes: zod.string(),
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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(false);
  const [code, setCode] = useState('');
  const view = useSearchParams().get('view');
  const isReadOnly = view !== null;

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const defaultValues = useMemo(
    () => ({
      logName: artistFormData?.logName || value ? name(artistFormData) : '',
      logAddress: artistFormData?.logAddress || value ? artistFormData?.residentialAddress : '',
      logZipCode: artistFormData?.logZipCode || value ? artistFormData?.zipCode : '',
      logCity: artistFormData?.logCity || value ? artistFormData?.city : '',
      logProvince: artistFormData?.logProvince || value ? artistFormData?.state : '',
      logCountry: artistFormData?.country || value ? artistFormData?.country : '',
      logEmail: artistFormData?.logEmail || value ? artistFormData?.email : '',
      logPhone: artistFormData?.logPhone || value ? artistFormData?.phone : '',
      logNotes: artistFormData?.logNotes || '',
      count: 6,
    }),
    [artistFormData, value]
  );

  const handleSuccess = (data) => {
    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
  };

  const { isPending, mutate } = useAddArtistMutation(handleSuccess);

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { trigger, reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });
    data.count = 6;

    mutate({ body: data });
  });

  useEffect(() => {
    reset({
      logName: value ? name(artistFormData) : artistFormData?.logName,
      logAddress: value ? artistFormData?.residentialAddress : artistFormData?.logAddress,
      logZipCode: value ? artistFormData?.zipCode : artistFormData?.logZipCode,
      logCity: value ? artistFormData?.city : artistFormData?.logCity,
      logProvince: value ? artistFormData?.state : artistFormData?.logProvince,
      logCountry: value ? artistFormData?.country : artistFormData?.logCountry,
      logEmail: value ? artistFormData?.email : artistFormData?.logEmail,
      logPhone: value ? artistFormData?.phone : artistFormData?.logPhone,
      logNotes: value ? artistFormData?.logNotes : artistFormData?.logNotes,
    });
  }, [value]);

  const viewNext = () => {
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
    setTabIndex(tabIndex + 1);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!methods.getValues('logName')) {
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
      <CardHeader title="Logistics" sx={{ mb: 2 }} />
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text disabled={isReadOnly} required name="logName" label="Logistic name" />
        <Field.Text disabled={isReadOnly} required name="logAddress" label="Logistic Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.CountrySelect
            disabled={isReadOnly}
            required
            fullWidth
            setCode={setCode}
            name="logCountry"
            label="Logistic Country"
            placeholder="Choose a country"
          />
          <Field.Text disabled={isReadOnly} required name="logZipCode" label="Logistic Zip/code" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} required name="logCity" label="Logistic City" />
          <Field.Text
            disabled={isReadOnly}
            required
            name="logProvince"
            label="Logistic State/Region"
          />

          <Field.Text disabled={isReadOnly} required name="logEmail" label="Logistic Email" />

          <Field.Phone
            fetchCode={methods.getValues('logPhone') ? null : code ? code : ''}
            disabled={isReadOnly}
            required
            name="logPhone"
            label="Logistic Phone"
          />
        </Box>

        <Field.Text
          disabled={isReadOnly}
          name="logNotes"
          label="Logistic Additional Notes"
          multiline
          rows={4}
        />
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 3 }}>
        {renderDetails}

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
