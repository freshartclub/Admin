import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Dialog, Switch, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import { useSearchParams } from 'src/routes/hooks';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_GENDER_OPTIONS, PRODUCT_LANGUAGE_OPTIONS } from 'src/_mock';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import useActivateArtistMutation from 'src/http/createArtist/useActivateArtistMutation';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  // managerArtistName: zod.string().min(1, { message: 'artistName is required!' }),
  // managerArtistSurnameOther1: zod.string(),
  // managerArtistSurname2: zod.string(),
  // managerArtistNickname: zod.string(),
  // managerArtistContactTo: zod.string(),
  // managerArtistPhone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  // managerArtistEmail: zod
  //   .string()
  //   .min(1, { message: 'Email is required!' })
  //   .email({ message: 'Email must be a valid email address!' }),
  // address: zod.string().min(1, { message: 'Address is required!' }),
  // managerZipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  // managerCity: zod.string().min(1, { message: 'City is required!' }),
  // managerState: zod.string().min(1, { message: 'Province is required!' }),
  // managerCountry: zod.string().min(1, { message: 'Country is required!' }),
  // managerArtistLanguage: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  // managerArtistGender: zod.string().min(1, { message: 'Gender is required!' }),
  // managerExtraInfo1: zod.string(),
  // managerExtraInfo2: zod.string(),
  // managerExtraInfo3: zod.string(),
  // documentName: zod.string().min(1, { message: 'Document Name is required!' }),
  // uploadDocs: schemaHelper.files({ required: false }),
});

// ----------------------------------------------------------------------

export function OtherDetails({
  artistFormData,
  setArtistFormData,
  setTabState,
  setTabIndex,
  tabIndex,
  tabState,
}: AddArtistComponentProps) {
  const view = useSearchParams().get('view');
  const isReadOnly = view !== null;

  const [showPop, setShowPop] = useState(false);

  const handleSuccess = (data) => {
    setArtistFormData({ ...artistFormData, ...data });
  };

  const handleActivateSuccess = (data) => {
    mutate(data);
  };

  const handleOnActivataion = () => {
    setShowPop(true);
  };

  const { isPending, mutate } = useAddArtistMutation(handleSuccess);
  const { isPending: isActivePending, mutate: activeMutate } =
    useActivateArtistMutation(handleActivateSuccess);
  const [isOn, setIsOn] = useState(false);

  const defaultValues = useMemo(
    () => ({
      documentName: artistFormData?.documentName || '',
      uploadDocs: artistFormData?.uploadDocs || [],
      managerArtistName: artistFormData?.managerArtistName || '',
      managerArtistSurnameOther1: artistFormData?.managerArtistSurnameOther1 || '',
      managerArtistSurname2: artistFormData?.managerArtistSurname2 || '',
      managerArtistNickname: artistFormData?.managerArtistNickname || '',
      managerArtistPhone: artistFormData?.managerArtistPhone || '',
      managerArtistEmail: artistFormData?.managerArtistEmail || '',
      address: artistFormData?.address || '',
      managerArtistContactTo: artistFormData?.managerArtistContactTo || '',
      managerZipCode: artistFormData?.managerZipCode || '',
      managerCity: artistFormData?.managerCity || '',
      managerState: artistFormData?.managerState || '',
      managerCountry: artistFormData?.managerCountry || '',
      managerArtistLanguage: artistFormData?.managerArtistLanguage || [],
      managerArtistGender: artistFormData?.managerArtistGender || '',
      managerExtraInfo1: artistFormData?.managerExtraInfo1 || '',
      managerExtraInfo2: artistFormData?.managerExtraInfo2 || '',
      managerExtraInfo3: artistFormData?.managerExtraInfo3 || '',
    }),
    [artistFormData]
  );

  const handleRemoveDocument = () => {
    setValue('uploadDocs', []);
  };

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });
  useEffect(() => {
    methods.watch('uploadDocs');
  }, []);

  const {
    reset,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });
    data.count = 7;
    data.isContainsImage = true;
    if (isOn) {
      data.isManagerDetails = true;
    }

    mutate({ body: data });
  });

  // const blob = new Blob([methods.getValues('uploadDocs')], { type: 'application/pdf' });
  // const blobURL = URL.createObjectURL(blob);

  const viewNext = () => {
    setTabIndex(0);
    setTabState((prev) => {
      prev[0].isSaved = true;
      return prev;
    });
  };

  const document = (
    <Card>
      <CardHeader title="Document" sx={{ mb: 1 }} />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text disabled={isReadOnly} name="documentName" label="Documents name" />

        <Typography variant="Document">Upload Document</Typography>

        {/* {methods.getValues('uploadDocs') ? (
          <div className="flex flex-col gap-2">
            <iframe
              src={`${import.meta.env.VITE_SERVER_BASE_URL}/uploads/documents/${artistFormData?.uploadDocs}`}
              width="100%"
              height="500px"
              title="PDF Document"
            />
            {isReadOnly ? (
              <span className="text-white opacity-1 bg-black rounded-md px-3 py-2 text-center">
                Click to Remove
              </span>
            ) : (
              <span
                onClick={() => methods.setValue('uploadDocs', '')}
                className="text-white bg-black rounded-md px-3 py-2 cursor-pointer text-center"
              >
                Click to Remove
              </span>
            )}
          </div>
        ) : (
          <Field.UploadDocument
            disabled={isReadOnly}
            accept="application/pdf"
            multiple
            helperText={'Plese upload pdf'}
            name="uploadDocs"
            maxSize={3145728}
            onDelete={handleRemoveDocument}
          />
        )} */}
        <Field.Upload
          disabled={isReadOnly}
          accept="application/pdf"
          multiple
          helperText={'Please upload pdf'}
          name="uploadDocs"
          maxSize={3145728}
          onRemove={handleRemoveDocument}
          // onDelete={handleRemoveDocument}
        />
      </Stack>
    </Card>
  );
  const renderDetails = (
    <Card sx={{ mb: 4 }}>
      <div className="flex justify-between items-center">
        <CardHeader title="Manager Details (If any)" sx={{ mb: 3 }} />
        <Switch disabled={isReadOnly} onClick={() => setIsOn((prev) => !prev)} />
      </div>

      <Divider />

      {isOn && (
        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          >
            <Field.Text disabled={isReadOnly} name="managerArtistName" label="Artist name" />

            <Field.Text
              disabled={isReadOnly}
              name="managerArtistSurnameOther1"
              label="Artist Surname 1"
            />

            <Field.Text
              disabled={isReadOnly}
              name="managerArtistSurname2"
              label="Artist Surname 2"
            />
          </Box>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.Text
              disabled={isReadOnly}
              name="managerArtistNickname"
              label="Artwork Nickname"
            />

            <Field.Text disabled={isReadOnly} name="managerArtistContactTo" label="Contact To" />
          </Box>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.Phone disabled={isReadOnly} name="managerArtistPhone" label="Phone number" />

            <Field.Text disabled={isReadOnly} name="managerArtistEmail" label="Email address" />
          </Box>

          <Field.Text disabled={isReadOnly} name="address" label="Address" />

          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
          >
            <Field.Text disabled={isReadOnly} name="managerZipCode" label="Zip/code" />
            <Field.Text disabled={isReadOnly} name="managerCity" label="City" />
            <Field.Text disabled={isReadOnly} name="managerState" label="Province/State/Region" />
            {/* <Field.Text name="managerCountry" label="Country" /> */}
            <Field.CountrySelect
              disabled={isReadOnly}
              fullWidth
              name="managerCountry"
              label="Country"
              placeholder="Choose a country"
            />
          </Box>

          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.MultiSelect
              disabled={isReadOnly}
              helperText=""
              checkbox
              name="managerArtistLanguage"
              placeholder="Select language"
              label="language"
              options={PRODUCT_LANGUAGE_OPTIONS}
            />

            <Field.SingelSelect
              disabled={isReadOnly}
              checkbox
              name="managerArtistGender"
              label="Gender"
              options={PRODUCT_GENDER_OPTIONS}
            />
          </Box>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          >
            <Field.Text disabled={isReadOnly} name="managerExtraInfo1" label="Extra Info 01" />
            <Field.Text disabled={isReadOnly} name="managerExtraInfo2" label="Extra Info 02" />
            <Field.Text disabled={isReadOnly} name="managerExtraInfo3" label="Extra Info 03" />
          </Box>
          {/* end section */}
        </Stack>
      )}
    </Card>
  );

  const dialogBox = (
    <Dialog
      open={showPop}
      onClose={() => {
        setShowPop(false);
      }}
    >
      <DialogTitle>Activate Your Artist</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you ready to bring your artist to life? Click the button below to activate and start
          artist journey!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <div className="flex gap-5">
          <button
            onClick={activeMutate}
            className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
          >
            {isActivePending ? 'Loading...' : 'Activate Artist'}
          </button>
          <button onClick={() => setShowPop(false)} className="text-red-500 rounded-lg font-medium">
            Maybe Later
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {document}

        {renderDetails}

        <div className="flex justify-end gap-5">
          {!isReadOnly ? (
            <>
              <button
                onClick={handleOnActivataion}
                className="text-white bg-green-600 rounded-md px-3 py-2 cursor-pointer"
              >
                Activate Artist
              </button>
              <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
                {isPending ? 'Loading...' : 'Save'}
              </button>
            </>
          ) : (
            <span
              onClick={viewNext}
              className="text-white bg-black rounded-md px-3 py-2 cursor-pointer"
            >
              Go Back
            </span>
          )}
        </div>
        {dialogBox}
      </Stack>
    </Form>
  );
}
