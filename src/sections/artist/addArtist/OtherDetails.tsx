import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { zodResolver } from '@hookform/resolvers/zod';
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
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import useActivateArtistMutation from 'src/http/createArtist/useActivateArtistMutation';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { useRevalidateArtist } from 'src/http/createArtist/useRevalidateArtist';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { RenderAllPicklists } from 'src/sections/Picklists/RenderAllPicklist';
import { z as zod } from 'zod';
import { FormHelperText } from '@mui/material';
import { AddressAutoComplete } from './AddressAutoComplete';
import { imgUrl } from 'src/utils/BaseUrls';
import countryFile from './country.json';
import { toast } from 'sonner';
import lang from './lang.json';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  documents: zod.array(
    zod.object({
      documentName: zod.string().min(1, { message: 'Document Name is required!' }),
      uploadDocs: schemaHelper.file({ message: { required_error: 'Document is required!' } }),
    })
  ),
  intTags: zod.string().array().optional(),
  extTags: zod.string().array().optional(),
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
  pRevalidation: zod
    .array(
      zod.object({
        revalidateFixedDate: zod.string().optional(),
        revalidateOn: zod.string().optional(),
      })
    )
    .optional(),
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

  const [searchResult, setSearchResult] = useState('');
  const [managerSearchResult, setManagerSearchResult] = useState('');
  const [reValidate, setReValidate] = useState(false);
  const [intValue, setIntValue] = useState('');
  const [extValue, setExtValue] = useState('');
  const [code, setCode] = useState('');

  const picklist = RenderAllPicklists([
    'Artist Internal Tags',
    'Artist External Tags',
    'Gender',
    'Language',
  ]);

  const picklistMap = picklist.reduce((acc, item: any) => {
    acc[item?.fieldName] = item?.picklist;
    return acc;
  }, {});

  const extarnal = picklistMap['Artist External Tags'];
  const internal = picklistMap['Artist Internal Tags'];
  const gender = picklistMap['Gender'];
  const language = picklistMap['Language'];

  const isReadOnly = view !== null;

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
  const { mutate: validateMutate, isPending: validatePending } = useRevalidateArtist();

  let documentArr: any = [];

  if (id && artistFormData) {
    artistFormData?.documents &&
      artistFormData?.documents?.length > 0 &&
      artistFormData?.documents?.forEach((item: any, i) =>
        documentArr.push({
          documentName: item.documentName,
          uploadDocs: `${imgUrl}/documents/${item.uploadDocs}`,
        })
      );
  }

  const isValid =
    artistFormData?.previousRevalidationDate && artistFormData?.previousRevalidationDate.length > 0
      ? true
      : false;

  const defaultValues = useMemo(
    () => ({
      documents: documentArr || [],
      intTags: artistFormData?.intTags || [],
      extTags: artistFormData?.extTags || [],
      lastRevalidationDate: artistFormData?.lastRevalidationDate || new Date().toString(),
      nextRevalidationDate:
        artistFormData?.nextRevalidationDate ||
        new Date(new Date().setDate(new Date().getDate() + 30)).toString(),
      managerName: artistFormData?.managerName || '',
      managerArtistPhone: artistFormData?.managerArtistPhone || '',
      managerArtistEmail: artistFormData?.managerArtistEmail || '',
      address: artistFormData?.managerAddress || '',
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
      pRevalidation: isValid
        ? artistFormData?.previousRevalidationDate
            ?.map((item: any) => ({
              revalidateFixedDate: item?.revalidateFixedDate,
              revalidateOn: item?.revalidatedOn,
            }))
            .reverse()
        : [] || '',
      count: 7,
      isContainsImage: true,
      isManagerDetails: false,
    }),
    [artistFormData, isValid]
  );

  const [isOn, setIsOn] = useState(artistFormData?.managerName ? true : false);
  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = methods;

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

    if (searchResult === '') {
      return toast.error('Emergency Contact Address is required');
    }

    if (managerSearchResult === '') data.address = '';

    if (isOn) {
      data.isManagerDetails = true;
    }

    if (artistFormData?.isActivated === true) {
      data.isActivated = true;
    }

    await trigger(undefined, { shouldFocus: true });
    mutate({ body: data });
  });

  const onActiveSubmit = handleSubmit(async (data) => {
    data.count = 7;
    data.isContainsImage = true;
    data.isManagerDetails = false;
    data.isActivated = true;

    if (searchResult === '') {
      return toast.error('Emergency Contact Address is required');
    }

    if (managerSearchResult === '') data.address = '';

    if (isOn) {
      data.isManagerDetails = true;
    }

    const language = artistFormData?.language || 'Spanish';
    const selectedLang = lang.find((item) => item.name === language);

    await trigger(undefined, { shouldFocus: true });
    activeMutate({ body: data, selectedLang: selectedLang?.code || 'ES' });
  });

  const onReValidateSubmit = () => {
    const language = artistFormData?.language || 'Spanish';
    const selectedLang = lang.find((item) => item.name === language);

    const newData = {
      id: artistFormData?._id,
      selectedLang: selectedLang?.code || 'ES',
    };

    validateMutate(newData);
  };

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

  useEffect(() => {
    setSearchResult(artistFormData?.emergencyContactAddress || '');
    setManagerSearchResult(artistFormData?.managerAddress || '');
  }, [artistFormData?.emergencyContactAddress, artistFormData?.managerAddress]);

  const placesSelected = (places: google.maps.places.PlaceResult) => {
    setValue('emergencyContactAddress', places.formatted_address);
    setSearchResult(places.formatted_address);
  };

  const managerPlacesSelected = (places: google.maps.places.PlaceResult) => {
    const postal_code = places.address_components.find((c) =>
      c.types.includes('postal_code')
    )?.long_name;
    const city = places.address_components.find((c) => c.types.includes('locality'))?.long_name;
    const state = places.address_components.find((c) =>
      c.types.includes('administrative_area_level_1')
    )?.long_name;
    const country = places.address_components.find((c) => c.types.includes('country'))?.long_name;

    setValue('managerCountry', country || '');
    setValue('managerState', state || '');
    setValue('managerCity', city || '');
    setValue('managerZipCode', postal_code || '');

    const address_comp = [
      'route',
      'street_number',
      'sublocality_level_1',
      'administrative_area_level_2',
    ];

    const comp = address_comp
      .map((type) => places.address_components?.find((c) => c.types.includes(type))?.long_name)
      .filter(Boolean);

    const fullAddress = comp.filter(Boolean).join(', ');

    setValue('address', fullAddress);
    setManagerSearchResult(fullAddress);
  };

  useEffect(() => {
    if (artistFormData?.phone) {
      const findCode = countryFile.find((item) => artistFormData?.phone?.includes(item.idd));
      setCode(findCode?.cca2 || '');
    }
  });

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
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {typeof methods.getValues(`documents[${index}].uploadDocs`) === 'object' ? (
                    <FileThumbnail
                      sx={{ cursor: 'pointer' }}
                      onClick={() => window.open(`${setUrl(index)}`, '_blank')}
                      file={methods.getValues(`documents[${index}].uploadDocs`)?.name}
                    />
                  ) : (
                    <FileThumbnail
                      sx={{ cursor: 'pointer' }}
                      onClick={() => window.open(`${setUrl(index)}`, '_blank')}
                      file={methods.getValues(`documents[${index}].uploadDocs`)}
                    />
                  )}

                  <span
                    onClick={() => handleRemoveDocument(index)}
                    className="ml-[3rem] text-[14px] absolute bg-red-100 text-red-500 rounded-md px-2 py-1 cursor-pointer"
                  >
                    Remove Document
                  </span>
                </Box>
              ) : (
                <>
                  <input
                    className="border border-gray-200 rounded-md px-2 py-3 hover:border-gray-600"
                    required
                    disabled={isReadOnly}
                    type="file"
                    accept="file/*"
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
            options={internal ? internal.map((item) => item.value) : []}
            value={intValue}
            onChange={(event, newValue) => setIntValue(newValue || '')}
            onInputChange={(event, newInputValue) => setIntValue(newInputValue)}
            renderInput={(params) => (
              <TextField {...params} label="Internal Tag Name" placeholder="Internal Tag Name" />
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
        {errors?.intTags && (
          <Typography variant="body2" color="error">
            {errors?.intTags?.message}
          </Typography>
        )}
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
            options={extarnal ? extarnal.map((i: any) => i.value) : []}
            value={extValue}
            onChange={(event, newValue) => setExtValue(newValue || '')}
            onInputChange={(event, newInputValue) => setExtValue(newInputValue)}
            renderInput={(params) => (
              <TextField {...params} label="External Tag Name" placeholder="External Tag Name" />
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
        {errors?.extTags && (
          <Typography variant="body2" color="error">
            {errors?.extTags?.message}
          </Typography>
        )}
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
        <Field.DatePicker disabled name="lastRevalidationDate" label="Last Revaliadtion Date" />
        <Field.DatePicker name="nextRevalidationDate" label="Next Revaliadtion Date" />
      </Stack>
    </Card>
  );

  const previousRevaliadtionInfo = (
    <Card>
      <CardHeader title="Previous Revaliadtion Information" sx={{ mb: 1 }} />
      <Divider />
      <Stack ml={1} spacing={3} direction={'column'} mb={2} padding={2}>
        {methods.getValues('pRevalidation').length > 0 &&
          methods.getValues('pRevalidation').map((i: any, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
              gap={2}
            >
              <Typography sx={{ fontWeight: 'bold' }}>
                Revalidation - {methods.getValues('pRevalidation').length - (index + 1) + 1}
              </Typography>
              <Field.MobileDateTimePicker
                name={`pRevalidation[${index}].revalidateFixedDate`}
                disabled
                label="Revalidation Initial Date"
              />
              <Field.MobileDateTimePicker
                name={`pRevalidation[${index}].revalidateOn`}
                disabled
                label="Revalidated On Date"
              />
            </Box>
          ))}
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
            <Field.Phone
              fetchCode={code ? code : ''}
              disabled={isReadOnly}
              name="managerArtistPhone"
              label="Manager Phone"
            />
            <Field.Text disabled={isReadOnly} name="managerArtistEmail" label="Manager Email" />
          </Box>

          <AddressAutoComplete
            name="address"
            disabled={isReadOnly}
            label="Manager Address"
            value={managerSearchResult}
            onChange={(e) => {
              setManagerSearchResult(e.target.value);
            }}
            onPlaceSelected={managerPlacesSelected}
          />

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
              options={language ? language : []}
            />

            <Field.SingelSelect
              disabled={isReadOnly}
              checkbox
              name="managerArtistGender"
              label="Manager Gender"
              options={gender ? gender : []}
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
          required
          disabled={isReadOnly}
          name="emergencyContactName"
          label="Emergency Contact Name"
        />
        <Field.Phone
          required
          disabled={isReadOnly}
          fetchCode={code ? code : ''}
          name="emergencyContactPhone"
          label="Emergency Contact Phone"
        />
        <Field.Text
          required
          disabled={isReadOnly}
          name="emergencyContactEmail"
          label="Emergency Contact Email"
        />
        <AddressAutoComplete
          name="emergencyContactAddress"
          disabled={isReadOnly}
          label="Emergency Contact Address *"
          value={searchResult}
          onChange={(e) => {
            setSearchResult(e.target.value);
          }}
          onPlaceSelected={placesSelected}
        />
        {errors.emergencyContactAddress && (
          <FormHelperText error>{errors.emergencyContactAddress.message}</FormHelperText>
        )}
        <Field.Text
          required
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

  const revalidateDialogBox = (
    <Dialog
      open={reValidate}
      onClose={() => {
        setReValidate(false);
      }}
    >
      <DialogTitle>Re-Validate Artist</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to re-validate this artist?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <div className="flex gap-5">
          <span
            onClick={onReValidateSubmit}
            className="text-white bg-green-600 rounded-md px-3 py-2 cursor-pointer"
          >
            {validatePending ? 'Loading...' : 'ReValidate Artist'}
          </span>
          <span
            onClick={() => setReValidate(false)}
            className="text-white bg-red-500 rounded-md px-2 py-2 cursor-pointer"
          >
            Cancel
          </span>
        </div>
      </DialogActions>
    </Dialog>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {document}
        {revaliadtionInfo}
        {methods.getValues('pRevalidation') &&
          methods.getValues('pRevalidation')?.length > 0 &&
          previousRevaliadtionInfo}
        {tags}
        {extraInfo}
        {emergencyInfo}
        {renderDetails}

        <div id="activate" className="flex justify-end gap-5">
          {!isReadOnly ? (
            <>
              {artistFormData &&
              artistFormData.isActivated &&
              new Date(artistFormData.nextRevalidationDate) <= new Date() ? (
                <span
                  onClick={() => setReValidate(true)}
                  className="text-white bg-orange-600 rounded-md px-3 py-2 cursor-pointer"
                >
                  ReValidate Artist
                </span>
              ) : null}
              {artistFormData && artistFormData.isActivated ? null : (
                <span
                  onClick={handleOnActivataion}
                  className="text-white bg-green-600 rounded-md px-3 py-2 cursor-pointer"
                >
                  Activate Artist
                </span>
              )}
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
        {revalidateDialogBox}
      </Stack>
    </Form>
  );
}
