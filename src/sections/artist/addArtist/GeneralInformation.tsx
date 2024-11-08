import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { today } from 'src/utils/format-time';
import { PRODUCT_GENDER_OPTIONS, PRODUCT_LANGUAGE_OPTIONS } from 'src/_mock';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { useSearchParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  // accountId: zod.string().min(1, { message: 'Account Id is required!' }),
  artistName: zod.string().min(1, { message: 'artistName is required!' }),
  artistSurname1: zod.string().min(1, { message: 'ArtistSurname is required!' }),
  artistSurname2: zod.string(),
  nickName: zod.string(),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  createDate: zod.string(),
  language: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  state: zod.string().min(1, { message: 'state is required!' }),
  residentialAddress: zod.string().min(1, { message: 'residentialAddress is required!' }),
  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email residentialAddress!' }),
  gender: zod.string().min(1, { message: 'Gender is required!' }),
  notes: zod.string(),
});

// ----------------------------------------------------------------------

export function GeneralInformation({
  artistFormData,
  setArtistFormData,
  setTabState,
  setTabIndex,
  tabIndex,
  tabState,
}: AddArtistComponentProps) {
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

  const defaultValues = useMemo(
    () => ({
      artistName: artistFormData?.artistName || '',
      artistSurname1: artistFormData?.artistSurname1 || '',
      artistSurname2: artistFormData?.artistSurname2 || '',
      nickName: artistFormData?.nickName || '',
      country: artistFormData?.country || 'Spain',
      zipCode: artistFormData?.zipCode || '',
      city: artistFormData?.city || '',
      state: artistFormData?.state || '',
      residentialAddress: artistFormData?.residentialAddress || '',
      phone: artistFormData?.phone || '',
      email: artistFormData?.email || '',
      language: artistFormData?.language || [],
      gender: artistFormData?.gender || '',
      createDate: artistFormData?.createDate || today(),
      notes: artistFormData?.notes || '',
      count: 1,
    }),
    [artistFormData]
  );

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = formProps;

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });
    data.count = 1;
    mutate({ body: data });
  });

  const viewNext = () => {
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
    setTabIndex(tabIndex + 1);
  };

  const renderDetails = (
    <Card>
      <CardHeader title="General Informations" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} required name="artistName" label="Artist name" />

          <Field.Text
            disabled={isReadOnly}
            required
            name="artistSurname1"
            label="Artist Surname 1"
          />

          <Field.Text disabled={isReadOnly} name="artistSurname2" label="Artist Surname 2" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} name="nickName" label="Artist Nickname" />
        </Box>

        <Field.CountrySelect
          required
          fullWidth
          name="country"
          label="Country"
          placeholder="Choose a country"
          disabled={isReadOnly}
        />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text disabled={isReadOnly} required name="zipCode" label="Zip/code" />
          <Field.Text disabled={isReadOnly} required name="city" label="City" />
          <Field.Text disabled={isReadOnly} required name="state" label="state/State/Region" />
        </Box>

        <Field.Text
          disabled={isReadOnly}
          required
          name="residentialAddress"
          label="residentialAddress"
        />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Phone
            disabled={isReadOnly}
            required
            name="phone"
            label="Phone number"
            helperText="Good to go"
          />

          <Field.Text disabled={isReadOnly} required name="email" label="Email" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.MultiSelect
            required
            checkbox
            name="language"
            disabled={isReadOnly}
            label="Select language"
            options={PRODUCT_LANGUAGE_OPTIONS}
          />

          <Field.SingelSelect
            required
            checkbox
            disabled={isReadOnly}
            name="gender"
            label="Gender"
            options={PRODUCT_GENDER_OPTIONS}
          />
        </Box>

        <Field.Text
          disabled={isReadOnly}
          name="notes"
          label="Internal Note description"
          multiline
          rows={4}
        />
      </Stack>
    </Card>
  );

  return (
    <Form methods={formProps} onSubmit={onSubmit}>
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
