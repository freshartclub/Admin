import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { PRODUCT_GENDER_OPTIONS, PRODUCT_LANGUAGE_OPTIONS } from 'src/_mock';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import useActivateArtistMutation from 'src/http/createArtist/useActivateArtistMutation';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { useSearchParams } from 'src/routes/hooks';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  documents: zod.array(
    zod.object({
      documentName: zod.string().min(1, { message: 'Document Name is required!' }),
      uploadDocs: schemaHelper.file({ message: { required_error: 'Document is required!' } }),
    })
  ),
  profileStatus: zod.string().min(1, { message: 'Profile Status is required!' }),
  intTags: zod.string().array().min(1, { message: 'Add at least one tag!' }),
  extTags: zod.string().array().min(1, { message: 'Add at least one tag!' }),
  managerName: zod.string().optional(),
  managerArtistPhone: zod.string().optional(),
  managerArtistEmail: zod.string().optional(),
  address: zod.string().optional(),
  lastRevalidationDate: zod.string().optional(),
  nextRevalidationDate: zod.string().optional(),
  managerAddress: zod.string().optional(),
  managerZipCode: zod.string().optional(),
  managerCity: zod.string().optional(),
  managerState: zod.string().optional(),
  managerCountry: zod.string().optional(),
  managerArtistLanguage: zod.string().array().optional(),
  managerArtistGender: zod.string().optional(),
  extraInfo1: zod.string().optional(),
  extraInfo2: zod.string().optional(),
  extraInfo3: zod.string().optional(),
  emergencyContactName: zod.string().min(1, { message: 'Emergency Contact Name is required!' }),
  emergencyContactPhone: zod.string().min(1, { message: 'Emergency Contact Phone is required!' }),
  emergencyContactEmail: zod.string().min(1, { message: 'Emergency Contact Email is required!' }),
  emergencyContactAddress: zod
    .string()
    .min(1, { message: 'Emergency Contact Addres is required!' }),
  emergencyContactRelation: zod
    .string()
    .min(1, { message: 'Emergency Contact Relation is required!' }),
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
  const navigate = useNavigate();
  const view = useSearchParams().get('view');
  const id = useSearchParams().get('id');
  const [intValue, setIntValue] = useState('');
  const [extValue, setExtValue] = useState('');

  const isReadOnly = view !== null;
  const url = 'https://dev.freshartclub.com/images';

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

  let documentArr: any = [];

  if (id && artistFormData) {
    artistFormData?.documents &&
      artistFormData?.documents?.length > 0 &&
      artistFormData?.documents?.forEach((item: any, i) =>
        documentArr.push({
          documentName: item.documentName,
          uploadDocs: `${url}/documents/${item.uploadDocs}`,
        })
      );
  }

  const defaultValues = useMemo(
    () => ({
      documents: documentArr || [],
      profileStatus: artistFormData?.profileStatus || '',
      intTags: artistFormData?.intTags || [],
      extTags: artistFormData?.extTags || [],
      lastRevalidationDate: artistFormData?.lastRevalidationDate || new Date().toString(),
      nextRevalidationDate:
        artistFormData?.nextRevalidationDate ||
        new Date(new Date().setDate(new Date().getDate() + 30)).toString(),
      managerName: artistFormData?.managerName || '',
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
      extraInfo1: artistFormData?.extraInfo1 || '',
      extraInfo2: artistFormData?.extraInfo2 || '',
      extraInfo3: artistFormData?.extraInfo3 || '',
      emergencyContactName: artistFormData?.emergencyContactName || '',
      emergencyContactPhone: artistFormData?.emergencyContactPhone || '',
      emergencyContactEmail: artistFormData?.emergencyContactEmail || '',
      emergencyContactAddress: artistFormData?.emergencyContactAddress || '',
      emergencyContactRelation: artistFormData?.emergencyContactRelation || '',
      count: 7,
      isContainsImage: true,
      isManagerDetails: false,
    }),
    [artistFormData]
  );

  const [isOn, setIsOn] = useState(artistFormData?.managerName ? true : false);
  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { setValue, trigger, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'documents',
  });

  const addDocuments = () => {
    append({
      documentName: '',
      uploadDocs: null,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const onSubmit = handleSubmit(async (data) => {
    data.count = 7;
    data.isContainsImage = true;
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
    data.isManagerDetails = false;

    if (isOn) {
      data.isManagerDetails = true;
    }

    await trigger(undefined, { shouldFocus: true });
    activeMutate({ body: data });
  });

  const handleIntSave = (item) => {
    const intVal = methods.getValues('intTags') || [];
    if (!intVal.includes(item)) {
      setValue('intTags', [...intVal, item]);
    }

    setIntValue('');
  };

  const handleExtSave = (item) => {
    const extVal = methods.getValues('extTags') || [];
    if (!extVal.includes(item)) {
      setValue('extTags', [...extVal, item]);
    }

    setExtValue('');
  };

  const handleRemoveIntTag = (index) => {
    const intVal = methods.getValues('intTags') || [];

    setValue(
      'intTags',
      intVal.filter((_, i) => i !== index)
    );
  };

  const handleRemoveExtTag = (index) => {
    const extVal = methods.getValues('extTags') || [];

    setValue(
      'extTags',
      extVal.filter((_, i) => i !== index)
    );
  };

  const viewNext = () => {
    setTabIndex(0);
    setTabState((prev) => {
      prev[0].isSaved = true;
      return prev;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      methods.setValue(`documents[${index}].uploadDocs`, file);
    }
  };

  const handleRemoveDocument = (index) => {
    methods.setValue(`documents[${index}].uploadDocs`, null);
  };

  const setUrl = (index) => {
    if (typeof methods.getValues(`documents[${index}].uploadDocs`) === 'object') {
      return URL.createObjectURL(methods.getValues(`documents[${index}].uploadDocs`));
    } else {
      return methods.getValues(`documents[${index}].uploadDocs`);
    }
  };

  const document = (
    <Card>
      <CardHeader title="Document" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} p={2}>
        <Stack spacing={2}>
          {fields.map((item, index) => (
            <Box key={index} columnGap={2} alignItems={'center'} rowGap={2} display="grid">
              <Field.Text
                disabled={isReadOnly}
                name={`documents[${index}].documentName`}
                label={`Document Name - ${index + 1}`}
              />

              {methods.watch(`documents[${index}].uploadDocs`) &&
              methods.getValues(`documents[${index}].uploadDocs`) ? (
                <Box
                  sx={{ position: 'relative', width: { xs: '80vw', md: '30vw' }, height: '40vh' }}
                >
                  <embed
                    title="Document Preview"
                    style={{ width: '100%', height: '100%' }}
                    src={setUrl(index)}
                    type="application/pdf"
                  />
                  <span
                    onClick={() => handleRemoveDocument(index)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#c4cdd5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '31px',
                      cursor: 'pointer',
                      paddingLeft: '4px',
                      paddingTop: '3px',
                    }}
                    title="Delete Video"
                  >
                    ✖
                  </span>
                </Box>
              ) : (
                <>
                  <input
                    required
                    disabled={isReadOnly}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </>
              )}

              {index === fields.length - 1 && (
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
              )}
            </Box>
          ))}
        </Stack>
        <Button
          disabled={isReadOnly}
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={addDocuments}
        >
          {fields.length > 0 ? 'Add More Documents' : 'Add Document'}
        </Button>
        <Field.Text disabled={isReadOnly} name="profileStatus" label="Profile Status" />
      </Stack>
    </Card>
  );

  const tags = (
    <Card>
      <CardHeader title="Artist Tags" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} mb={2} padding={2}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Autocomplete
            disabled={isReadOnly}
            freeSolo
            fullWidth
            options={[]}
            value={intValue}
            onChange={(event, newValue) => setIntValue(newValue || '')}
            onInputChange={(event, newInputValue) => setIntValue(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Internal Tag Name"
                placeholder="Internal Tag Name"
                required
              />
            )}
            openOnFocus
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleIntSave(intValue)}
            disabled={!intValue.trim()}
          >
            Save
          </Button>
        </Box>
        {methods.watch('intTags') && methods.getValues('intTags').length > 0 && (
          <div className="flex flex-wrap gap-2 mt-[-1rem]">
            {methods.getValues('intTags').map((i, index) => (
              <Stack
                direction={'row'}
                alignItems="center"
                sx={{
                  display: 'flex',
                  gap: 0.3,
                  backgroundColor: 'rgb(214 244 249)',
                  color: 'rgb(43 135 175)',
                  fontSize: '14px',
                  padding: '3px 7px',
                  borderRadius: '9px',
                }}
                key={index}
              >
                <span>{i}</span>
                <Iconify
                  icon="material-symbols:close-rounded"
                  sx={{ cursor: 'pointer', padding: '2px' }}
                  onClick={() => handleRemoveIntTag(index)}
                />
              </Stack>
            ))}
          </div>
        )}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Autocomplete
            disabled={isReadOnly}
            freeSolo
            fullWidth
            options={[]}
            value={extValue}
            onChange={(event, newValue) => setExtValue(newValue || '')}
            onInputChange={(event, newInputValue) => setExtValue(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="External Tag Name"
                placeholder="External Tag Name"
                required
              />
            )}
            openOnFocus
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleExtSave(extValue)}
            disabled={!extValue.trim()}
          >
            Save
          </Button>
        </Box>
        {methods.watch('extTags') && methods.getValues('extTags').length > 0 && (
          <div className="flex flex-wrap gap-2 mt-[-1rem]">
            {methods.getValues('extTags').map((i, index) => (
              <Stack
                direction={'row'}
                alignItems="center"
                sx={{
                  display: 'flex',
                  gap: 0.3,
                  backgroundColor: 'rgb(214 244 249)',
                  color: 'rgb(43 135 175)',
                  fontSize: '14px',
                  padding: '3px 7px',
                  borderRadius: '9px',
                }}
                key={index}
              >
                <span>{i}</span>
                <Iconify
                  icon="material-symbols:close-rounded"
                  sx={{ cursor: 'pointer', padding: '2px' }}
                  onClick={() => handleRemoveExtTag(index)}
                />
              </Stack>
            ))}
          </div>
        )}
      </Stack>
    </Card>
  );

  const revaliadtionInfo = (
    <Card>
      <CardHeader title="Revaliadtion Information" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} mb={2} padding={2}>
        <Field.DatePicker
          disabled={isReadOnly}
          name="lastRevalidationDate"
          label="Last Revaliadtion Date"
        />
        <Field.DatePicker
          disabled={isReadOnly}
          name="nextRevalidationDate"
          label="Next Revaliadtion Date"
        />
      </Stack>
    </Card>
  );

  const extraInfo = (
    <Card>
      <CardHeader title="Extra Information" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} mb={2} padding={2}>
        <Field.Text disabled={isReadOnly} name="extraInfo1" label="Extra Info 1" />
        <Field.Text disabled={isReadOnly} name="extraInfo2" label="Extra Info 2" />
        <Field.SingelSelect
          disabled={isReadOnly}
          name="extraInfo3"
          label="Extra Info 3"
          options={[
            { value: 'Info 1', label: 'Info 1' },
            { value: 'Info 2', label: 'Info 2' },
          ]}
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
        <Stack spacing={3} sx={{ p: 2 }}>
          <Field.Text disabled={isReadOnly} name="managerName" label="Manager Name" />
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.Phone disabled={isReadOnly} name="managerArtistPhone" label="Manager Phone" />
            <Field.Text disabled={isReadOnly} name="managerArtistEmail" label="Manager Email" />
          </Box>

          <Field.Text disabled={isReadOnly} name="address" label="Manager Address" />

          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
          >
            <Field.CountrySelect
              disabled={isReadOnly}
              fullWidth
              name="managerCountry"
              label="Manager Country"
            />
            <Field.Text disabled={isReadOnly} name="managerZipCode" label="Manager Zip/code" />
            <Field.Text disabled={isReadOnly} name="managerCity" label="Manager City" />
            <Field.Text disabled={isReadOnly} name="managerState" label="Manager State/Region" />
          </Box>

          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.MultiSelect
              disabled={isReadOnly}
              checkbox
              name="managerArtistLanguage"
              label="Manager Language"
              options={PRODUCT_LANGUAGE_OPTIONS}
            />

            <Field.SingelSelect
              disabled={isReadOnly}
              checkbox
              name="managerArtistGender"
              label="Manager Gender"
              options={PRODUCT_GENDER_OPTIONS}
            />
          </Box>
        </Stack>
      )}
    </Card>
  );

  const emergencyInfo = (
    <Card>
      <CardHeader title="Emergency Information" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} mb={2} padding={2}>
        <Field.Text
          disabled={isReadOnly}
          name="emergencyContactName"
          label="Emergency Contact Name"
        />
        <Field.Phone
          disabled={isReadOnly}
          name="emergencyContactPhone"
          label="Emergency Contact Phone"
        />
        <Field.Text
          disabled={isReadOnly}
          name="emergencyContactEmail"
          label="Emergency Contact Email"
        />
        <Field.Text
          disabled={isReadOnly}
          name="emergencyContactAddress"
          label="Emergency Contact Addres"
        />
        <Field.Text
          disabled={isReadOnly}
          name="emergencyContactRelation"
          label="Emergency Contact Relation"
        />
      </Stack>
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
        {revaliadtionInfo}
        {tags}
        {extraInfo}
        {emergencyInfo}
        {renderDetails}

        <div className="flex justify-end gap-5">
          {!isReadOnly ? (
            <>
              <span className="text-white bg-orange-600 rounded-md px-3 py-2 cursor-pointer">
                ReValidate Artist
              </span>
              <span
                onClick={handleOnActivataion}
                className="text-white bg-green-600 rounded-md px-3 py-2 cursor-pointer"
              >
                Activate Artist
              </span>
              <span
                onClick={() => navigate(paths.dashboard.artist.allArtist)}
                className="text-white bg-red-500 rounded-md px-3 py-2 cursor-pointer"
              >
                Cancel
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
