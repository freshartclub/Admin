import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  Avatar,
  InputAdornment,
  ListItemText,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import {
  ARTWORK_AVAILABLETO_OPTIONS,
  ARTWORK_COLLECTIONLIST_OPTIONS,
  ARTWORK_COLORS_OPTIONS,
  ARTWORK_DISCOUNTACCEPTATION_OPTIONS,
  ARTWORK_DOWNWARDOFFER_OPTIONS,
  ARTWORK_EMOTIONS_OPTIONS,
  ARTWORK_FRAMED_OPTIONS,
  ARTWORK_HANGING_OPTIONS,
  ARTWORK_MATERIAL_OPTIONS,
  ARTWORK_OFFENSIVE_OPTIONS,
  ARTWORK_ORIENTATION_OPTIONS,
  ARTWORK_PROMOTIONS_OPTIONS,
  ARTWORK_PURCHASECATALOG_OPTIONS,
  ARTWORK_STYLE_OPTIONS,
  ARTWORK_TAGES_OPTIONS,
  ARTWORK_UPWORKOFFER_OPTIONS,
  PRODUCT_SERIES_OPTIONS,
} from 'src/_mock';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { z as zod } from 'zod';
import { useGetArtworkById } from '../Artwork-details-view/http/useGetArtworkById';
import { useGetDisciplineMutation } from '../DisciplineListCategory/http/useGetDisciplineMutation';
import { useGetTechnicMutation } from '../TechnicListCategory/http/useGetTechnicMutation';
import { useGetThemeListMutation } from '../ThemeListCategory/http/useGetThemeListMutation';
import useCreateArtworkMutation from './http/useCreateArtworkMutation';
import { useGetArtistById } from './http/useGetArtistById';
import { FormControl } from '@mui/material';
import { FormLabel } from '@mui/material';
import { RadioGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Radio } from '@mui/material';
// import { useGetPicklistMutation } from '../Picklists/http/useGetPicklistMutation';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';
import { easeOut } from 'framer-motion';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  artworkName: zod.string().min(1, { message: 'Artwork Name is required!' }),
  artistID: zod.string().min(1, { message: 'Artist ID is required!' }),
  artistName: zod.string().min(1, { message: 'artistName is required!' }),
  isArtProvider: zod.string().min(1, { message: 'isArtProvider is required!' }),
  provideArtistName: zod.string().optional(),
  artworkCreationYear: zod.string().optional(),
  artworkSeries: zod.string().min(1, { message: 'Artwork Series is required!' }),
  productDescription: zod.string().optional(),
  mainImage: schemaHelper.file({ message: { required_error: 'Main Photo is required!' } }),
  backImage: schemaHelper.file({ required: false }).optional(),
  inProcessImage: schemaHelper.file({ required: false }).optional(),
  images: zod.any(),
  mainVideo: schemaHelper.file({ required: false }).optional(),
  otherVideo: zod.any(),
  artworkTechnic: zod.string().min(1, { message: 'Artwork Technic is required!' }),
  artworkTheme: zod.string().min(1, { message: 'artworkTheme is required!' }),
  artworkOrientation: zod.string().min(1, { message: 'Artwork Orientation is required!' }),
  material: zod.string().min(1, { message: 'material is required!' }),
  weight: zod.string().min(1, { message: 'weight required!' }),
  height: zod.string().min(1, { message: 'height required!' }),
  lenght: zod.string().min(1, { message: 'lenght required!' }),
  width: zod.string().min(1, { message: 'width required!' }),
  hangingAvailable: zod.string().min(1, { message: 'Hanging Available required!' }),
  hangingDescription: zod.string().optional(),
  framed: zod.string().min(1, { message: 'Framed is required!' }),
  framedDescription: zod.string().optional(),
  frameHeight: zod.string().optional(),
  frameLenght: zod.string().optional(),
  frameWidth: zod.string().optional(),
  artworkStyle: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  emotions: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  colors: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  purchaseCatalog: zod.string().optional(),
  subscriptionCatalog: zod.string().optional(),
  artistFees: zod.string().optional(),
  downwardOffer: zod.string().optional(),
  upworkOffer: zod.string().optional(),
  acceptOfferPrice: zod.string().optional(),
  priceRequest: zod.string().optional(),
  basePrice: zod.string().min(1, { message: 'Base price is required!' }),
  dpersentage: zod
    .string()
    .min(1, { message: 'Discount should not be $0.00' })
    .refine(
      (value) => {
        const parsed = parseFloat(value);
        return !isNaN(parsed) && parsed <= 100;
      },
      { message: 'Discount percentage cannot exceed 100%' }
    ),
  vatAmount: zod.string().optional(),
  activeTab: zod.string().optional(),
  purchaseOption: zod.string().optional(),
  offensive: zod.string().optional(),
  pCode: zod.string().min(1, { message: 'Product Code is required!' }),
  location: zod.string().min(1, { message: 'location is required!' }),
  artworkDiscipline: zod.string(),
  artworkTags: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  promotion: zod.string().optional(),
  promotionScore: zod.any(),
  availableTo: zod.string().optional(),
  discountAcceptation: zod.string().optional(),
  collectionList: zod.string().optional(),
  existingImages: zod.any().array().optional(),
  existingVideos: zod.any().array().optional(),
  currency: zod.string().min(1, { message: 'currency is required!' }),
});

// ----------------------------------------------------------------------

export function ArtworkAdd({ currentProduct }) {
  const [pArr, setPArr] = useState<{ value: string; label: string }[]>([]);
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');
  const { data: disciplineData } = useGetDisciplineMutation();
  const { data: technicData } = useGetTechnicMutation();
  const { data: themeData } = useGetThemeListMutation();

  const picklist = RenderAllPicklist('Currency');
  const plans = RenderAllPicklist('Plans');

  const PRODUCT_CATAGORYONE_OPTIONS =
    disciplineData && disciplineData.length > 0
      ? disciplineData
          .filter((item: any) => !item.isDeleted)
          .map((item: any) => ({
            value: item?.disciplineName,
            label: item?.disciplineName,
          }))
      : [];

  let TechnicArr: any = [];
  const TechnicOptions =
    technicData && technicData.length > 0
      ? technicData
          .filter((item: any) => !item.isDeleted)
          .map((item: any) => {
            let localObj: any = {
              value: '',
              label: '',
              disciplineName: [],
            };

            localObj.value = item?.technicName;
            localObj.label = item?.technicName;
            localObj.disciplineName =
              item?.discipline &&
              item?.discipline.length > 0 &&
              item?.discipline.map((item: any) => item?.disciplineName);

            TechnicArr.push(localObj);

            return TechnicArr;
          })
      : [];

  let ThemeArr: any = [];
  const ThemeOptions =
    themeData && themeData.length > 0
      ? themeData
          .filter((item: any) => !item.isDeleted)
          .map((item: any) => {
            let localObj: any = {
              value: '',
              label: '',
              disciplineName: [],
            };

            localObj.value = item?.themeName;
            localObj.label = item?.themeName;
            localObj.disciplineName =
              item?.discipline &&
              item?.discipline.length > 0 &&
              item?.discipline.map((item: any) => item?.disciplineName);

            ThemeArr.push(localObj);

            return ThemeArr;
          })
      : [];

  const id = useSearchParams().get('id');
  const { data, isLoading } = useGetArtworkById(id);

  const [mongoDBId, setmongoDBId] = useState(null);
  const [open, setOpen] = useState(true);
  const [percent, setPercent] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');

  let arr: any = [];
  let videoArr: any = [];

  if (id && data?.data) {
    data?.data?.media?.images &&
      data?.data?.media?.images.length > 0 &&
      data?.data?.media?.images.map((item) => arr.push(`${data?.url}/users/${item}`));

    data?.data?.media?.otherVideo &&
      data?.data?.media?.otherVideo.length > 0 &&
      data?.data?.media?.otherVideo.map((item) => videoArr.push(`${data?.url}/videos/${item}`));
  }

  const defaultValues = useMemo(
    () => ({
      artworkName: data?.data?.artworkName || '',
      artistID: data?.data?.owner?.artistId || '',
      artistName: data?.data?.owner?.artistName || '',
      isArtProvider: data?.data?.isArtProvider || '',
      provideArtistName: data?.data?.provideArtistName || '',
      artworkCreationYear: data?.data?.artworkCreationYear || '',
      artworkSeries: data?.data?.artworkSeries || '',
      productDescription: data?.data?.productDescription || '',

      mainImage: data?.data?.media?.mainImage
        ? `${data?.url}/users/${data?.data?.media?.mainImage}`
        : null,
      backImage: data?.data?.media?.backImage
        ? `${data?.url}/users/${data?.data?.media?.backImage}`
        : null,
      inProcessImage: data?.data?.media?.inProcessImage
        ? `${data?.url}/users/${data?.data?.media?.inProcessImage}`
        : null,
      mainVideo: data?.data?.media?.mainVideo
        ? `${data?.url}/videos/${data?.data?.media?.mainVideo}`
        : null,
      images: arr || [],
      otherVideo: videoArr || [],
      existingImages: data?.data?.media?.images || [],
      existingVideos: data?.data?.media?.otherVideo || [],

      artworkTechnic: data?.data?.additionalInfo?.artworkTechnic || '',
      artworkTheme: data?.data?.additionalInfo?.artworkTheme || '',
      artworkOrientation: data?.data?.additionalInfo?.artworkOrientation || '',
      material: data?.data?.additionalInfo?.material || '',
      weight: data?.data?.additionalInfo?.weight || '',
      lenght: data?.data?.additionalInfo?.length || '',
      height: data?.data?.additionalInfo?.height || '',
      width: data?.data?.additionalInfo?.width || '',
      hangingAvailable: data?.data?.additionalInfo?.hangingAvailable || '',
      hangingDescription: data?.data?.additionalInfo?.hangingDescription || ' ',
      framed: data?.data?.additionalInfo?.framed || '',
      framedDescription: data?.data?.additionalInfo?.framedDescription || ' ',
      frameHeight: data?.data?.additionalInfo?.frameHeight || '',
      frameLenght: data?.data?.additionalInfo?.frameLength || '',
      frameWidth: data?.data?.additionalInfo?.frameWidth || '',
      artworkStyle: data?.data?.additionalInfo?.artworkStyle || [],
      emotions: data?.data?.additionalInfo?.emotions || [],
      colors: data?.data?.additionalInfo?.colors || [],
      purchaseCatalog: data?.data?.commercialization?.purchaseCatalog || '',
      subscriptionCatalog: data?.data?.commercialization?.subscriptionCatalog || '',
      downwardOffer: data?.data?.commercialization?.downwardOffer || '',
      upworkOffer: data?.data?.commercialization?.upworkOffer || '',
      acceptOfferPrice: data?.data?.commercialization?.acceptOfferPrice || '',
      priceRequest: data?.data?.commercialization?.priceRequest || '',
      purchaseOption: data?.data?.commercialization?.purchaseOption || '',
      artistbaseFees: data?.data?.commercialization?.artistbaseFees || '',
      activeTab: data?.data?.commercialization?.activeTab || '',
      basePrice: data?.data?.pricing?.basePrice || '',
      currency: data?.data?.pricing?.currency || '',
      dpersentage: data?.data?.pricing?.dpersentage || '',
      vatAmount: data?.data?.pricing?.vatAmount || '',
      artistFees: data?.data?.pricing?.artistFees || '',
      offensive: data?.data?.additionalInfo?.offensive || '',
      pCode: data?.data?.inventoryShipping?.pCode || '',
      location: data?.data?.inventoryShipping?.location || '',
      artworkDiscipline: data?.data?.discipline?.artworkDiscipline || '',
      artworkTags: data?.data?.discipline?.artworkTags || [],
      promotion: data?.data?.promotions?.promotion || '',
      promotionScore: data?.data?.promotions?.promotionScore || '',
      availableTo: data?.data?.restriction?.availableTo || '',
      discountAcceptation: data?.data?.restriction?.discountAcceptation || '',
      collectionList: data?.data?.collectionList || '',
    }),
    [data?.data]
  );

  const { mutate, isPending } = useCreateArtworkMutation(id);

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;
  const values = watch();

  const selectedDisciplines = useWatch({
    control: methods.control,
    name: 'artworkDiscipline',
  });

  const debounceArtistId = useDebounce(search, 1000);
  const { data: artistData } = useGetArtistById(debounceArtistId);

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (data && !isLoading) {
      reset(defaultValues);
    }
  }, [data, isLoading]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      methods.setValue('artworkCreationYear', year);
      methods.setValue('activeTab', selectedOption);

      data.artworkCreationYear = methods.getValues('artworkCreationYear');
      data.activeTab = methods.getValues('activeTab');
      data.existingImages = methods.getValues('existingImages');
      data.existingVideos = methods.getValues('existingVideos');

      const newData = {
        data: data,
        id: mongoDBId,
      };

      mutate({
        newData: newData,
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.floor((loaded * 100) / total);

          setPercent(percentCompleted);
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFileDetails = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
      setValue('existingImages', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
    setValue('existingImages', [], { shouldValidate: true });
  }, [setValue]);

  const handleRemoveFileone = useCallback(() => {
    setValue('backImage', null);
  }, [setValue]);

  const handleRemoveFile = useCallback(() => {
    setValue('mainImage', null);
  }, [setValue]);

  const handleRemoveFiletwo = useCallback(() => {
    setValue('inProcessImage', null);
  }, [setValue]);

  const handleRemoveFileVideo = useCallback(() => {
    setValue('mainVideo', null);
  }, [setValue]);

  const handleRemoveotherVideo = useCallback(
    (inputFile) => {
      const filtered = values.otherVideo && values.otherVideo?.filter((file) => file !== inputFile);
      setValue('otherVideo', filtered);
      setValue('existingVideos', filtered);
    },
    [setValue, values.otherVideo]
  );

  const handleRemoveFileotherVideo = useCallback(() => {
    setValue('otherVideo', [], { shouldValidate: true });
    setValue('existingVideos', [], { shouldValidate: true });
  }, [setValue]);

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const refillData = (artistData) => {
    setValue('artistID', artistData?.artistId);
    setValue('artistName', name(artistData));
    setmongoDBId(artistData?._id);
    setSearch('');
  };

  const filterTechnicForDiscipline = (selectedDiscipline) => {
    return TechnicArr.filter((style) => style.disciplineName.includes(selectedDiscipline));
  };

  const filterThemeForDiscipline = (selectedDiscipline) => {
    return ThemeArr.filter((style) => style.disciplineName.includes(selectedDiscipline));
  };

  const currentYear = dayjs();

  useEffect(() => {
    const tempArr: { value: string; label: string }[] = [];
    for (let i = 0; i <= 100; i++) {
      tempArr.push({ value: `${i}`, label: `${i}` });
    }
    setPArr(tempArr);

    if (id) {
      setOpen(false);
      setmongoDBId(data?.data?.owner?._id);
      setSelectedOption(data?.data?.commercialization?.activeTab);
      setYear(data?.data?.artworkCreationYear);
    }
  }, [data?.data]);

  const getValue = () => {
    console.log(search);
    return methods.getValues('artistID') ? methods.getValues('artistID') : search ? search : '';
  };

  const removeText = () => {
    setValue('artistID', '');
    setValue('artistName', '');
    setSearch('');
  };

  const options = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const renderDetails = (
    <Card sx={{ mb: 3, position: 'relative' }}>
      <CardHeader title="General Informations" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <div className="relative">
          <Field.Text
            disabled={id ? true : false}
            name="artistID"
            label="Artist ID"
            placeholder="Search by artist Name/Email"
            value={
              search ? search : methods.getValues('artistID') ? methods.getValues('artistID') : ''
            }
            onChange={(e) => {
              setSearch(e.target.value);
              if (methods.getValues('artistID')) methods.setValue('artistID', '');
            }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    onClick={removeText}
                    component="span"
                    sx={{ color: 'text.disabled', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    X
                  </Box>
                </InputAdornment>
              ),
            }}
          />
          {search !== '' && (
            <div className="absolute top-16 w-[100%] rounded-lg z-10 h-[30vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto ">
              <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {artistData && artistData.length > 0 ? (
                  artistData.map((i, j) => (
                    <TableCell
                      onClick={() => refillData(i)}
                      key={j}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <Stack spacing={2} direction="row" alignItems="center">
                        <Avatar alt={i?.artistName} src={i?.profile?.mainImage} />

                        <ListItemText
                          disableTypography
                          primary={
                            <Typography variant="body2" noWrap>
                              {i?.artistName} {i?.artistSurname1} {i?.artistSurname2} - {i?.userId}
                            </Typography>
                          }
                          secondary={
                            <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                              {i?.email}
                            </Link>
                          }
                        />
                      </Stack>
                    </TableCell>
                  ))
                ) : (
                  <TableCell>No Data Available</TableCell>
                )}
              </TableRow>
            </div>
          )}
        </div>
        <Field.Text disabled name="artistName" label=" Artist Name" />
        <Field.Text name="artworkName" label="Artwork Name" />
        <Field.SingelSelect options={options} name="isArtProvider" label="Is Art Provider" />
        {methods.getValues('isArtProvider') === 'yes' && (
          <Field.Text name="provideArtistName" label="Art Provider Name" />
        )}
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <DatePicker
            name="artworkCreationYear"
            label="Artwork Year"
            // value={dayjs(data?.data?.artworkCreationYear) || currentYear}
            maxDate={currentYear}
            defaultValue={dayjs(data?.data?.artworkCreationYear)}
            views={['year']}
            openTo="year"
            onChange={(e) => {
              const selectedYear = (e as any).$y.toString();
              setYear(selectedYear);
            }}
          />

          <Field.SingelSelect
            checkbox
            name="artworkSeries"
            label="Artwork Series"
            options={PRODUCT_SERIES_OPTIONS}
          />
        </Box>

        <Field.Text name="productDescription" label="Product Description" multiline rows={4} />
      </Stack>
    </Card>
  );

  const media = (
    <Card className="mb-6">
      <CardHeader title="Media" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <div>
            <Typography>Main Photo</Typography>
            <Field.Upload name="mainImage" maxSize={3145728} onDelete={handleRemoveFile} />
          </div>

          <div>
            <Typography>Back Photo</Typography>
            <Field.Upload name="backImage" maxSize={3145728} onDelete={handleRemoveFileone} />
          </div>

          <div>
            <Typography>Inprocess Photo</Typography>
            <Field.Upload name="inProcessImage" maxSize={3145728} onDelete={handleRemoveFiletwo} />
          </div>
        </Box>
        <div>
          <Typography variant="subtitle2">Details Photos</Typography>
          <Field.Upload
            helperText="Only 3 files are allowed at a time"
            multiple
            accpet="image/*"
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFileDetails}
            onRemoveAll={handleRemoveAllFiles}
          />
        </div>
        <Box>
          <div>
            <Typography>Main Video</Typography>
            <Field.MultiVideo name="mainVideo" onDelete={handleRemoveFileVideo} />
          </div>
          <div>
            <Typography>Other Video</Typography>
            <Field.MultiVideo
              thumbnail
              helperText="Only 3 files are allowed at a time"
              accept="video/*"
              onRemoveAll={handleRemoveFileotherVideo}
              onRemove={handleRemoveotherVideo}
              multiple
              name="otherVideo"
            />
          </div>
        </Box>
      </Stack>
    </Card>
  );

  const additionalInformation = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Categorization" sx={{ mb: 2 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="artworkDiscipline"
          label="Artwork Discipline"
          options={PRODUCT_CATAGORYONE_OPTIONS}
        />
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.SingelSelect
            checkbox={selectedDisciplines && selectedDisciplines.length > 0}
            name="artworkTechnic"
            label="Artwork Technic"
            options={
              selectedDisciplines && selectedDisciplines
                ? filterTechnicForDiscipline(selectedDisciplines)
                : [
                    {
                      value: '',
                      label: 'Please select discipline first',
                    },
                  ]
            }
          />

          <Field.SingelSelect
            checkbox={selectedDisciplines && selectedDisciplines.length > 0}
            name="artworkTheme"
            label="Artwork Theme"
            options={
              selectedDisciplines && selectedDisciplines
                ? filterThemeForDiscipline(selectedDisciplines)
                : [
                    {
                      value: '',
                      label: 'Please select discipline first',
                    },
                  ]
            }
          />
        </Box>
        <Field.SingelSelect
          checkbox
          name="artworkOrientation"
          label="Artwork Orientation"
          options={ARTWORK_ORIENTATION_OPTIONS}
        />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.SingelSelect
            checkbox
            name="material"
            label="Material"
            options={ARTWORK_MATERIAL_OPTIONS}
          />

          <Field.SingelSelect
            checkbox
            name="offensive"
            label="Offensive"
            options={ARTWORK_OFFENSIVE_OPTIONS}
          />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          <Field.Text name="weight" label="Weight (in kg)" />
          <Field.Text name="height" label="Height (in cm)" />
          <Field.Text name="lenght" label="Lenght (in cm)" />
          <Field.Text name="width" label="Width (in cm)" />
        </Box>
        <Field.MultiSelect
          checkbox
          name="artworkTags"
          label="Artwork Tags"
          options={ARTWORK_TAGES_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="hangingAvailable"
          label="Hanging available"
          options={ARTWORK_HANGING_OPTIONS}
        />
        <Field.Text name="hangingDescription" label="Hanging Description" multiline rows={3} />
        <Field.SingelSelect
          checkbox
          name="framed"
          label="Framed"
          options={ARTWORK_FRAMED_OPTIONS}
        />
        <Field.Text name="framedDescription" label="Framed Description" multiline rows={3} />
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="frameHeight" label="Height (in cm)" />
          <Field.Text name="frameLenght" label="Lenght (in cm)" />
          <Field.Text name="frameWidth" label="Width (in cm)" />
        </Box>
        <Field.MultiSelect
          checkbox
          name="artworkStyle"
          label="Artwork Style"
          options={ARTWORK_STYLE_OPTIONS}
        />
        <Field.MultiSelect
          checkbox
          name="emotions"
          label="Emotions"
          options={ARTWORK_EMOTIONS_OPTIONS}
        />
        <Field.MultiSelect checkbox name="colors" label="Colors" options={ARTWORK_COLORS_OPTIONS} />
      </Stack>
    </Card>
  );

  const Commercialization = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Commercialization" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <FormControl fullWidth component="fieldset">
          <FormLabel component="legend">Purchase Options</FormLabel>
          <RadioGroup
            name="activeTab"
            sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <FormControlLabel
              value="subscription"
              checked={selectedOption === 'subscription'}
              control={<Radio />}
              label="Subscription"
              sx={{ flex: 1 }}
            />
            <FormControlLabel
              value="purchase"
              checked={selectedOption === 'purchase'}
              control={<Radio />}
              label="Purchase/Sale"
              sx={{ flex: 1 }}
            />
          </RadioGroup>
        </FormControl>
        {selectedOption === 'subscription' && (
          <>
            <Field.SingelSelect
              checkbox
              name="subscriptionCatalog"
              label="Subscription Catalog"
              options={plans}
            />
            <Field.SingelSelect
              checkbox
              name="purchaseOption"
              label="Purchase Option"
              options={ARTWORK_PURCHASECATALOG_OPTIONS}
            />
          </>
        )}
        {selectedOption === 'purchase' && (
          <>
            <Field.SingelSelect
              checkbox
              name="purchaseCatalog"
              label="Purchase Catalog"
              options={ARTWORK_PURCHASECATALOG_OPTIONS}
            />
            <Field.Text name="artistbaseFees" label="Artist Fees" />

            <Field.SingelSelect
              checkbox
              name="upworkOffer"
              label="Upwork Offer"
              options={ARTWORK_UPWORKOFFER_OPTIONS}
            />
            <Field.SingelSelect
              checkbox
              name="downwardOffer"
              label="Downward Offer"
              options={ARTWORK_DOWNWARDOFFER_OPTIONS}
            />
            <Field.Text name="acceptOfferPrice" label="Accept offer min. price" />

            <Field.SingelSelect
              checkbox
              name="priceRequest"
              label="Price by request"
              options={ARTWORK_UPWORKOFFER_OPTIONS}
            />
          </>
        )}
      </Stack>
    </Card>
  );
  const pricing = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Pricing" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Field.Text
            name="basePrice"
            label="Base Price"
            placeholder="Base Price"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.85rem' }}>
                    {methods.getValues('currency')}
                  </Box>
                </InputAdornment>
              ),
            }}
          />
          <Field.SingelSelect
            required
            sx={{ minWidth: 150 }}
            name="currency"
            label="Currency"
            options={picklist ? picklist : []}
          />
        </Stack>
        <Field.Text
          name="dpersentage"
          label="Discounted Percentage"
          placeholder="0.00%"
          // type="number"
        />

        <Field.Text name="vatAmount" label="VAT Amount (%)" />
        <Field.Text
          name="artistFees"
          label="Artist Fees"
          placeholder="Artist Fees"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.85rem' }}>
                  {methods.getValues('currency')}
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Card>
  );
  const InventoryandShiping = (
    <Card>
      <CardHeader title="Inventory and Shipping" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="pCode" label="Product code" />
          <Field.Text name="location" label="Location" />
        </Box>
      </Stack>
    </Card>
  );

  const Promotions = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Promotions" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="promotion"
          label="Promotion"
          options={ARTWORK_PROMOTIONS_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="promotionScore"
          label="Promotion Score"
          options={pArr ? pArr : []}
        />
      </Stack>
    </Card>
  );
  const Restrictions = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Restrictions" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="availableTo"
          label="Available To"
          options={ARTWORK_AVAILABLETO_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="discountAcceptation"
          label="Discount Acceptation"
          options={ARTWORK_DISCOUNTACCEPTATION_OPTIONS}
        />
      </Stack>
    </Card>
  );

  const Collection = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Collection" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="collectionList"
          label="Collection List"
          options={ARTWORK_COLLECTIONLIST_OPTIONS}
        />
      </Stack>
    </Card>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 3 }}>
        <div className="grid md:grid-cols-3 gap-2">
          <div className="col-span-2">
            {renderDetails}
            {media}
            {additionalInformation}
            {Commercialization}
            {pricing}
            {InventoryandShiping}
          </div>

          <div className="col-span-1">
            {Promotions}
            {Restrictions}
            {Collection}
          </div>
        </div>
        <div className="flex justify-end mb-6 mr-6">
          <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
            {isPending ? 'Processing ' + percent + '%' : 'Preview'}
          </button>
        </div>
      </Stack>
    </Form>
  );
}
