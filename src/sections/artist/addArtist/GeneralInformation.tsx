import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { useSearchParams } from 'src/routes/hooks';
import { RenderAllPicklists } from 'src/sections/Picklists/RenderAllPicklist';
import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';
import { z as zod } from 'zod';
import { AddressAutoComplete, getCityStateFromZipCountry } from './AddressAutoComplete';
import { FormHelperText } from '@mui/material';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

const NewProductSchema = zod.object({
  artistName: zod.string().min(1, { message: 'Artist Name is required!' }),
  artistSurname1: zod.string().min(1, { message: 'Surname 1 is required!' }),
  artistSurname2: zod.string(),
  nickName: zod.string(),
  dob: zod.string().min(1, { message: 'Date of Birth is required!' }),
  country: zod.string().min(1, { message: 'Country is required!' }),
  language: zod.string().min(1, { message: 'Langage is required' }),
  currency: zod.string().min(1, { message: 'Currency is required' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  state: zod.string().min(1, { message: 'state is required!' }),
  residentialAddress: zod.string().min(1, { message: 'Residential Address is required!' }),
  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email!' }),
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
  const [code, setCode] = useState('');
  const view = useSearchParams().get('view');
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const isReadOnly = view !== null;

  const handleSuccess = (data) => {
    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
  };

  const picklist = RenderAllPicklists(['Language', 'Currency', 'Gender']);
  const picklistMap = picklist.reduce((acc, item: any) => {
    acc[item?.fieldName] = item?.picklist;
    return acc;
  }, {});

  const language = picklistMap['Language'];
  const currency = picklistMap['Currency'];
  const gender = picklistMap['Gender'];

  const { isPending, mutate } = useAddArtistMutation(handleSuccess);

  const defaultValues = useMemo(
    () => ({
      artistName: artistFormData?.artistName || '',
      artistSurname1: artistFormData?.artistSurname1 || '',
      artistSurname2: artistFormData?.artistSurname2 || '',
      nickName: artistFormData?.nickName || '',
      dob: artistFormData?.dob || '',
      country: artistFormData?.country || '',
      zipCode: artistFormData?.zipCode || '',
      city: artistFormData?.city || '',
      state: artistFormData?.state || '',
      residentialAddress: artistFormData?.residentialAddress || '',
      phone: artistFormData?.phone || '',
      email: artistFormData?.email || '',
      language: artistFormData?.language || '',
      currency: artistFormData?.currency || 'EUR (Euro)',
      gender: artistFormData?.gender || '',
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
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = formProps;

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });

    if (!searchResult) {
      return toast.error('Residential Address is required!');
    }
    data.residentialAddress = searchResult;
    data.count = 1;
    mutate({ body: data });
  });

  const country = formProps.watch('country');
  const zipCode = formProps.watch('zipCode');

  const [searchResult, setSearchResult] = useState('');

  const viewNext = () => {
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
    setTabIndex(tabIndex + 1);
  };

  useEffect(() => {
    if (zipCode && country && zipCode.length > 4) {
      getCityStateFromZipCountry(zipCode, country, apiKey).then(({ city, state }) => {
        formProps.setValue('city', city || '');
        formProps.setValue('state', state || '');
      });
    }
  }, [zipCode, country]);

  useEffect(() => {
    setSearchResult(artistFormData?.residentialAddress || '');
  }, [artistFormData?.residentialAddress]);

  const placesSelected = (places: google.maps.places.PlaceResult) => {
    const address_comp = ['route', 'street_number', 'sublocality_level_1'];

    const comp = address_comp
      .map((type) => places.address_components?.find((c) => c.types.includes(type))?.long_name)
      .filter(Boolean);

    const fullAddress = comp.filter(Boolean).join(', ');

    setValue('residentialAddress', fullAddress);
    setSearchResult(fullAddress);
  };

  const renderDetails = (
    <Card>
      <CardHeader title="General Informations" sx={{ mb: 2 }} />
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
          <Field.Text disabled={isReadOnly} name="nickName" label="Artist Display Name" />
          <Field.DatePicker required disabled={isReadOnly} name="dob" label="Date of Birth" />
        </Box>

        <Field.CountrySelect
          required
          fullWidth
          setCode={!formProps.getValues('country') && setCode}
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
          <Field.Text disabled={isReadOnly} required name="state" label="State/Region" />
        </Box>

        <AddressAutoComplete
          name="residentialAddress"
          disabled={isReadOnly}
          label="Residential Address *"
          value={searchResult}
          onChange={(e) => {
            setSearchResult(e.target.value);
          }}
          onPlaceSelected={placesSelected}
        />
        {errors.residentialAddress && (
          <FormHelperText sx={{ mt: 0 }} error>
            {errors.residentialAddress.message}
          </FormHelperText>
        )}

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
            fetchCode={!formProps.getValues('country') ? null : code ? code : ''}
            label="Phone number"
          />

          <Field.Text disabled={isReadOnly} required name="email" label="Email" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.SingelSelect
            required
            name="language"
            disabled={isReadOnly}
            label="Select language"
            options={language ? language : []}
          />

          <Field.SingelSelect
            required
            name="currency"
            disabled={isReadOnly}
            label="Select Currency"
            options={currency ? currency : []}
          />

          <Field.SingelSelect
            required
            disabled={isReadOnly}
            name="gender"
            label="Gender"
            options={gender ? gender : []}
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
