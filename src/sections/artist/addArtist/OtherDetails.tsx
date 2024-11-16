import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Dialog, Switch, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import { useSearchParams } from 'src/routes/hooks';
import { PRODUCT_GENDER_OPTIONS, PRODUCT_LANGUAGE_OPTIONS } from 'src/_mock';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import useActivateArtistMutation from 'src/http/createArtist/useActivateArtistMutation';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  documentName: zod.string().min(1, { message: 'Document Name is required!' }).optional(),
  uploadDocs: schemaHelper.files({ required: false }).optional(),
  existingDocuments: zod.any().array().optional(),
  managerArtistName: zod.string().optional(),
  managerArtistSurnameOther1: zod.string().optional(),
  managerArtistSurname2: zod.string().optional(),
  managerArtistNickname: zod.string().optional(),
  managerArtistContactTo: zod.string().optional(),
  managerArtistPhone: zod.string().optional(),
  managerArtistEmail: zod.string().optional(),
  address: zod.string().optional(),
  managerZipCode: zod.string().optional(),
  managerCity: zod.string().optional(),
  managerState: zod.string().optional(),
  managerCountry: zod.string().optional(),
  managerArtistLanguage: zod.string().array().optional(),
  managerArtistGender: zod.string().optional(),
  managerExtraInfo1: zod.string().optional(),
  managerExtraInfo2: zod.string().optional(),
  managerExtraInfo3: zod.string().optional(),
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
  const id = useSearchParams().get('id');

  const isReadOnly = view !== null;
  const url = "https://dev.freshartclub.com/images"

  const [showPop, setShowPop] = useState(false);

  const handleSuccess = (data) => {
    setArtistFormData({ ...artistFormData, ...data });
  };

  const handleOnActivataion = () => {
    setShowPop(true);
  };

  const { isPending, mutate } = useAddArtistMutation(handleSuccess);
  const { isPending: isActivePending, mutate: activeMutate } =
    useActivateArtistMutation(handleSuccess);

  let documentArr = [];

  if (id && artistFormData) {
    artistFormData?.uploadDocs && artistFormData?.uploadDocs?.length > 0 && artistFormData?.uploadDocs?.forEach((item: any, i) => (
      documentArr.push(`${url}/documents/${item}`)
    ));
  }

  console.log(documentArr);

  const defaultValues = useMemo(
    () => ({
      documentName: artistFormData?.documentName || '',
      uploadDocs: documentArr || [],
      existingDocuments: artistFormData?.uploadDocs || [],
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
      count: 7,
      isContainsImage: true,
      isManagerDetails: false,
    }),
    [artistFormData]
  );

  const [isOn, setIsOn] = useState(artistFormData?.managerArtistName ? true : false);

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    setValue,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleRemoveDocument = useCallback(
    (doc) => {
      const arr = methods.getValues('uploadDocs').filter((val) => val !== doc);
      setValue('uploadDocs', arr);
      setValue('existingDocuments', arr);
    },
    [setValue]
  );

  // const handleDuplicateDocument = () => {
  //   const arr = methods.getValues('uploadDocs');
  //   const seenNames = new Set();

  //   const uniqueFiles = arr.filter((doc) => {
  //     if (seenNames.has(doc.name)) {
  //       return false;
  //     }
  //     seenNames.add(doc.name);
  //     return true;
  //   });

  //   setValue('uploadDocs', uniqueFiles);
  // };

  useEffect(() => {
    methods.watch('uploadDocs');
    // handleDuplicateDocument();
  }, [methods.getValues('uploadDocs')]);

  const onSubmit = handleSubmit(async (data) => {
    data.count = 7;
    data.isContainsImage = true;
    data.uploadDocs = methods.getValues('uploadDocs');
    data.existingDocuments = methods.getValues('existingDocuments');
    data.isManagerDetails = false;

    if (isOn) {
      data.isManagerDetails = true;
    }

    await trigger(undefined, { shouldFocus: true });
    mutate({ body: data });
  });

  const onActiveSubmit = handleSubmit(async (data) => {
    data.count = 7;
    data.isContainsImage = true;
    data.uploadDocs = methods.getValues('uploadDocs');
    data.isManagerDetails = false;
    if (isOn) {
      data.isManagerDetails = true;
    }

    await trigger(undefined, { shouldFocus: true });
    activeMutate({ body: data });
  });

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

        <Typography variant="body2">Upload Document</Typography>
        <Field.Upload
          disabled={isReadOnly}
          accept="application/pdf"
          multiple
          helperText={'Please upload pdf'}
          name="uploadDocs"
          maxSize={3145728}
          onRemove={handleRemoveDocument}
        />
      </Stack>
    </Card>
  );

  const renderDetails = (
    <Card sx={{ mb: 4 }}>
      <div className="flex justify-between items-center">
        <CardHeader title="Manager Details (If any)" sx={{ mb: 3 }} />
        <Switch disabled={isReadOnly} checked={isOn} onClick={() => setIsOn((prev) => !prev)} />
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
            <Field.Phone
              helperText={'Please enter phone number'}
              disabled={isReadOnly}
              name="managerArtistPhone"
              label="Phone number"
            />

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
              helperText="Please select language"
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
            onClick={onActiveSubmit}
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
              <span
                onClick={handleOnActivataion}
                className="text-white bg-green-600 rounded-md px-3 py-2 cursor-pointer"
              >
                Activate Artist
              </span>
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
