import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
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
  const view = useSearchParams().get('view');
  const isReadOnly = view !== null;

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  let val;
  const defaultValues = useMemo(
    () => ({
      logName: artistFormData?.logName || val ? name(artistFormData) : '',
      logAddress: artistFormData?.logAddress || val ? artistFormData?.residentialAddress : '',
      logZipCode: artistFormData?.logZipCode || val ? artistFormData?.zipCode : '',
      logCity: artistFormData?.logCity || val ? artistFormData?.city : '',
      logProvince: artistFormData?.logProvince || val ? artistFormData?.state : '',
      logCountry: artistFormData?.country || val ? artistFormData?.country : '',
      logEmail: artistFormData?.logEmail || val ? artistFormData?.email : '',
      logPhone: artistFormData?.logPhone || val ? artistFormData?.phone : '',
      logNotes: artistFormData?.logNotes || '',
      count: 6,
    }),
    [artistFormData, val]
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

  const { trigger, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });
    data.count = 6;

    mutate({ body: data });
  });

  const viewNext = () => {
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
    setTabIndex(tabIndex + 1);
  };

  setTimeout(() => {
    if (!artistFormData?.logName) {
      val = window.confirm('Would you like to copy data from general information?');
    }
  }, 2000);

  const renderDetails = (
    <Card>
      <CardHeader title="Logistics" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text disabled={isReadOnly} required name="logName" label="Log name" />

        <Field.Text disabled={isReadOnly} required name="logAddress" label="Logistic Address" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} required name="logZipCode" label="Log Zip/code" />

          <Field.Text disabled={isReadOnly} required name="logCity" label=" Log City" />
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
            name="logProvince"
            label="Log Province/State/Region"
          />

          <Field.CountrySelect
            disabled={isReadOnly}
            required
            fullWidth
            name="logCountry"
            label="Log Country"
            placeholder="Choose a country"
          />

          <Field.Text disabled={isReadOnly} required name="logEmail" label="Email address" />

          <Field.Phone disabled={isReadOnly} required name="logPhone" label="Log Phone number" />
        </Box>

        <Field.Text
          disabled={isReadOnly}
          name="logNotes"
          label="Log Additional Notes"
          multiline
          rows={4}
        />
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
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
    </Form>
  );
}
