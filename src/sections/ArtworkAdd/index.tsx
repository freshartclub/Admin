import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  Autocomplete,
  Avatar,
  CircularProgress,
  DialogContent,
  InputAdornment,
  ListItemText,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import {
  ARTWORK_COLLECTIONLIST_OPTIONS,
  ARTWORK_FRAMED_OPTIONS,
  ARTWORK_HANGING_OPTIONS,
  ARTWORK_MATERIAL_OPTIONS,
  ARTWORK_OFFENSIVE_OPTIONS,
  ARTWORK_ORIENTATION_OPTIONS,
  ARTWORK_PROMOTIONS_OPTIONS,
  ARTWORK_PURCHASECATALOG_OPTIONS,
} from 'src/_mock';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  Slider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { z as zod } from 'zod';
import { useGetArtworkById } from '../Artwork-details-view/http/useGetArtworkById';
import { useGetDisciplineMutation } from '../DisciplineListCategory/http/useGetDisciplineMutation';
import { RenderAllPicklists } from '../Picklists/RenderAllPicklist';
import { useGetStyleListMutation } from '../StyleListCategory/http/useGetStyleListMutation';
import { useGetTechnicMutation } from '../TechnicListCategory/http/useGetTechnicMutation';
import { useGetThemeListMutation } from '../ThemeListCategory/http/useGetThemeListMutation';
import useAddArtistSeries from './http/useAddArtistSeries';
import useCreateArtworkMutation from './http/useCreateArtworkMutation';
import { useGetArtistById } from './http/useGetArtistById';
import { useGetSeriesList } from './http/useGetSeriesList';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  artworkName: zod.string().min(1, { message: 'Artwork Name is required!' }),
  artistID: zod.string().min(1, { message: 'Artist ID is required!' }),
  artistName: zod.string().min(1, { message: 'artistName is required!' }),
  isArtProvider: zod.string().min(1, { message: 'isArtProvider is required!' }),
  provideArtistName: zod.string().optional(),
  artworkCreationYear: zod.string().optional(),
  artworkSeries: zod.string().optional(),
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
  purchaseType: zod.string().optional(),
  acceptOfferPrice: zod.string().optional(),
  basePrice: zod.string().min(1, { message: 'Base price is required!' }),
  dpersentage: zod.number().max(100, { message: 'Discount cannot exceed 100%!' }).optional(),
  vatAmount: zod
    .number()
    .min(1, { message: 'Vat Amount is required!' })
    .max(100, { message: 'Vat Amount cannot exceed 100%!' }),
  activeTab: zod.string().optional(),
  purchaseOption: zod.string().optional(),
  offensive: zod.string().optional(),
  pCode: zod.string().optional(),
  location: zod.string().optional(),
  artworkDiscipline: zod.string().min(1, { message: 'Artwork Discipline is required!' }),
  intTags: zod.string().array().optional(),
  extTags: zod.string().array().optional(),
  promotion: zod.string().optional(),
  promotionScore: zod.number().optional(),
  availableTo: zod.string().optional(),
  discountAcceptation: zod.string().optional(),
  collectionList: zod.string().optional(),
  existingImages: zod.any().array().optional(),
  existingVideos: zod.any().array().optional(),
  currency: zod.string().min(1, { message: 'currency is required!' }),
  commingSoon: zod.boolean().optional(),
  packageHeight: zod.string().min(1, { message: 'Package Height is required!' }),
  packageLength: zod.string().min(1, { message: 'Package Lenght is required!' }),
  packageWidth: zod.string().min(1, { message: 'Package Width is required!' }),
  packageWeight: zod.string().min(1, { message: 'Package Weight is required!' }),
  packageMaterial: zod.string().min(1, { message: 'Package Material is required!' }),
});

// ----------------------------------------------------------------------

export function ArtworkAdd() {
  const [year, setYear] = useState('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [intValue, setIntValue] = useState('');
  const [extValue, setExtValue] = useState('');
  const [slide, setSlide] = useState(0);

  const { data: disciplineData } = useGetDisciplineMutation();
  const { data: technicData } = useGetTechnicMutation();
  const { data: themeData } = useGetThemeListMutation();
  const { data: styleData } = useGetStyleListMutation();

  const picklist = RenderAllPicklists([
    'Commercialization Options',
    'Currency',
    'Package Material',
    'Emotions',
    'Colors',
    'Artwork Available To',
    'Artwork Discount Options',
  ]);

  const picklistMap = picklist.reduce((acc, item: any) => {
    acc[item?.fieldName] = item?.picklist;
    return acc;
  }, {});

  const purOption = picklistMap['Commercialization Options'];
  const currency = picklistMap['Currency'];
  const packMaterial = picklistMap['Package Material'];
  const emotions = picklistMap['Emotions'];
  const colors = picklistMap['Colors'];
  const availableTo = picklistMap['Artwork Available To'];
  const discountAcceptation = picklistMap['Artwork Discount Options'];

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

  let StyleArr: any = [];
  const StyleOptions =
    styleData && styleData.length > 0
      ? styleData
          .filter((item: any) => !item.isDeleted)
          .map((item: any) => {
            let localObj: any = {
              value: '',
              label: '',
              disciplineName: [],
            };

            localObj.value = item?.styleName;
            localObj.label = item?.styleName;
            localObj.disciplineName =
              item?.discipline &&
              item?.discipline.length > 0 &&
              item?.discipline.map((item: any) => item?.disciplineName);

            StyleArr.push(localObj);

            return StyleArr;
          })
      : [];

  const id = useSearchParams().get('id');
  const { data, isLoading } = useGetArtworkById(id);

  const [mongoDBId, setmongoDBId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [series, setSeries] = useState('');
  const [percent, setPercent] = useState(0);
  const [selectedOption, setSelectedOption] = useState('subscription');

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
      intTags: data?.data?.tags?.intTags || [],
      extTags: data?.data?.tags?.extTags || [],
      artistName: data?.data?.owner?.artistName || '',
      isArtProvider: data?.data?.isArtProvider || 'No',
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
      purchaseType: data?.data?.commercialization?.purchaseType || '',
      purchaseOption: data?.data?.commercialization?.purchaseOption || '',
      activeTab: data?.data?.commercialization?.activeTab || '',
      basePrice: data?.data?.pricing?.basePrice || '',
      currency: data?.data?.pricing?.currency || 'EUR',
      dpersentage: data?.data?.pricing?.dpersentage || 0,
      vatAmount: data?.data?.pricing?.vatAmount || 0,
      acceptOfferPrice: data?.data?.pricing?.acceptOfferPrice || '',
      artistFees: data?.data?.pricing?.artistFees || '',
      offensive: data?.data?.additionalInfo?.offensive || '',
      pCode: data?.data?.inventoryShipping?.pCode || '',
      location: data?.data?.inventoryShipping?.location || '',
      commingSoon: data?.data?.inventoryShipping?.commingSoon || false,
      packageMaterial: data?.data?.inventoryShipping?.packageMaterial || '',
      packageWeight: data?.data?.inventoryShipping?.packageWeight || '',
      packageLength: data?.data?.inventoryShipping?.packageLength || '',
      packageHeight: data?.data?.inventoryShipping?.packageHeight || '',
      packageWidth: data?.data?.inventoryShipping?.packageWidth || '',
      artworkDiscipline: data?.data?.discipline?.artworkDiscipline || '',
      promotion: data?.data?.promotions?.promotion || '',
      promotionScore: Number(data?.data?.promotions?.promotionScore) || slide,
      availableTo: data?.data?.restriction?.availableTo || availableTo ? availableTo[0]?.value : '',
      discountAcceptation:
        data?.data?.restriction?.discountAcceptation || discountAcceptation
          ? discountAcceptation[0]?.value
          : '',
      collectionList: data?.data?.collectionList || '',
    }),
    [data?.data]
  );

  const { mutate, isPending } = useCreateArtworkMutation(id);

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;
  const values = watch();

  const selectedDisciplines = useWatch({
    control: methods.control,
    name: 'artworkDiscipline',
  });

  const debounceArtistId = useDebounce(search, 1000);
  const { data: artistData, isLoading: artistLoading } = useGetArtistById(debounceArtistId);

  const { mutateAsync, isPending: isSeriesLoad } = useAddArtistSeries();
  const { data: artworkData, refetch } = useGetSeriesList(mongoDBId);

  useEffect(() => {
    if (data && !isLoading) {
      reset(defaultValues);
    }
  }, [data, isLoading]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      methods.setValue('artworkCreationYear', year);
      methods.setValue('activeTab', selectedOption);

      if (selectedOption === 'subscription') {
        const val1 = methods.getValues('subscriptionCatalog');
        const val2 = methods.getValues('purchaseOption');
        data.purchaseCatalog = '';
        data.purchaseType = '';
        if (!val1 || !val2) return toast.error('Please select subscription catalog');
      }

      if (selectedOption === 'purchase') {
        const val1 = methods.getValues('purchaseCatalog');
        const val2 = methods.getValues('purchaseType');
        data.subscriptionCatalog = '';
        data.purchaseOption = '';
        if (!val1 || !val2) return toast.error('Please select purchase catalog');
      }

      let hasMainImg = methods.getValues('mainImage') ? true : false;
      let hasMainVideo = methods.getValues('mainVideo') ? true : false;
      let hasBackImg = methods.getValues('backImage') ? true : false;
      let hasInProcessImg = methods.getValues('inProcessImage') ? true : false;

      data.artworkCreationYear = methods.getValues('artworkCreationYear');
      data.artistFees = methods.getValues('artistFees');
      data.activeTab = methods.getValues('activeTab');
      data.existingImages = methods.getValues('existingImages');
      data.existingVideos = methods.getValues('existingVideos');
      data.promotionScore = slide;
      data.hasMainImg = hasMainImg;
      data.hasMainVideo = hasMainVideo;
      data.hasBackImg = hasBackImg;
      data.hasInProcessImg = hasInProcessImg;

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

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.nickName) fullName += ' ' + `"${val?.nickName}"`;
    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const refillData = (artistData) => {
    setValue('artistID', artistData?.artistId);
    setValue('artistName', name(artistData));
    setValue('isArtProvider', artistData?.artProvider);
    setValue('provideArtistName', '');
    setmongoDBId(artistData?._id);
    setSearch('');
    refetch();
  };

  const filterTechnicForDiscipline = (selectedDiscipline) => {
    return TechnicArr.filter((style) => style.disciplineName.includes(selectedDiscipline));
  };

  const filterThemeForDiscipline = (selectedDiscipline) => {
    return ThemeArr.filter((style) => style.disciplineName.includes(selectedDiscipline));
  };

  const filterStyleForDiscipline = (selectedDiscipline) => {
    return StyleArr.filter((style) => style.disciplineName.includes(selectedDiscipline));
  };

  const currentYear = dayjs();

  useEffect(() => {
    if (id) {
      setOpen(false);
      setmongoDBId(data?.data?.owner?._id);
      setSelectedOption(data?.data?.commercialization?.activeTab);
      setYear(data?.data?.artworkCreationYear);
      setSlide(data?.data?.promotions?.promotionScore);
    }
  }, [data?.data]);

  useEffect(() => {
    setValue('vatAmount', artworkData?.vatAmount);
  }, [artworkData]);

  const removeText = () => {
    reset({
      artistName: '',
      artistID: '',
      isArtProvider: '',
      provideArtistName: '',
      artworkSeries: '',
      vatAmount: null,
      artistFees: null,
    });
    setmongoDBId(null);
    setSearch('');
  };

  const handleCreateSeries = () => {
    if (!mongoDBId) return toast.error('Search For Artist First');
    const data = {
      id: mongoDBId,
      seriesName: series,
    };
    mutateAsync(data).then(() => {
      setDialogOpen(false);
      setSeries('');
    });
    refetch();
  };

  const handleChange = (e) => {
    const _id = e.target.dataset.value;
    if (selectedOption === 'subscription') {
      const artistFeesVal = artworkData.subscriptionCatalog.find((item) => item._id === _id);
      setValue('artistFees', artistFeesVal?.artistFees);
    } else {
      const artistFeesVal = artworkData.purchaseCatalog.find((item) => item._id === _id);
      setValue('artistFees', artistFeesVal?.artistFees);
    }
  };

  const valuetext = (value: number) => {
    if (value === 0) return `${data?.data?.promotions?.promotionScore}`;
    setSlide(value);
    return `${value}`;
  };

  const fixPrice = methods.watch('purchaseType');

  const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 5,
      label: '5',
    },
    {
      value: 10,
      label: '10',
    },
    {
      value: 20,
      label: '20',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 100,
      label: '100',
    },
  ];

  const addSeriesDialogBox = (
    <Dialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
        setSeries('');
      }}
    >
      <DialogTitle>Add New Series</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <DialogContentText>
          Add New Series to this artist. This series will be added to the artist.{' '}
        </DialogContentText>
        <Field.Text
          name="seriesName"
          label="Series Name"
          placeholder="Series Name"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <button
          onClick={handleCreateSeries}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {isSeriesLoad ? 'Loading...' : 'Save'}
        </button>
      </DialogActions>
    </Dialog>
  );

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
                {artistLoading ? (
                  <TableCell>
                    <CircularProgress size={30} />
                  </TableCell>
                ) : artistData?.data && artistData?.data?.length > 0 ? (
                  artistData?.data.map((i, j) => (
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
                        <Avatar
                          alt={i?.artistName}
                          src={`${artistData?.url}/users/${i?.mainImage}`}
                        />

                        <ListItemText
                          disableTypography
                          primary={
                            <Typography variant="body2" noWrap>
                              {name(i)} - {i?.artistId}
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
        {methods.getValues('isArtProvider') === 'No' && (
          <Field.Text disabled name="artistName" label="Artist Name" />
        )}
        {methods.getValues('isArtProvider') === 'Yes' && (
          <Field.Text name="provideArtistName" label="Artist Name" />
        )}

        <Field.Text name="artworkName" label="Artwork Name" />
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

          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
            <Field.SingelSelect
              sx={{ width: '100%' }}
              name="artworkSeries"
              label="Artwork Series"
              options={
                mongoDBId
                  ? artworkData?.seriesList
                    ? artworkData?.seriesList.map((i) => ({ value: i, label: i }))
                    : [{ value: '', label: 'No Series Found' }]
                  : [
                      {
                        value: '',
                        label: 'Search For Artist First',
                      },
                    ]
              }
            />
            {mongoDBId && (
              <Iconify
                onClick={() => setDialogOpen(true)}
                className="cursor-pointer"
                icon="mingcute:add-line"
              />
            )}
          </Box>
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
        <Field.MultiSelect
          checkbox={selectedDisciplines && selectedDisciplines.length > 0}
          name="artworkStyle"
          label="Artwork Style"
          options={
            selectedDisciplines && selectedDisciplines
              ? filterStyleForDiscipline(selectedDisciplines)
              : [
                  {
                    value: '',
                    label: 'Please select discipline first',
                  },
                ]
          }
        />
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.MultiSelect
            checkbox
            name="emotions"
            label="Emotions"
            options={emotions ? emotions : []}
          />
          <Field.MultiSelect checkbox name="colors" label="Colors" options={colors ? colors : []} />
          <Field.SingelSelect
            checkbox
            name="offensive"
            label="Offensive"
            options={ARTWORK_OFFENSIVE_OPTIONS}
          />
        </Box>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Autocomplete
              // disabled={isReadOnly}
              freeSolo
              fullWidth
              options={[]}
              value={intValue}
              onChange={(event, newValue) => setIntValue(newValue || '')}
              onInputChange={(event, newInputValue) => setIntValue(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add Internal Tags"
                  placeholder="Add Internal Tags"
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
              Add
            </Button>
          </Box>
          {errors.extTags && <Alert severity="error">{errors.intTags.message}</Alert>}
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
              // disabled={isReadOnly}
              freeSolo
              fullWidth
              options={[]}
              value={extValue}
              onChange={(event, newValue) => setExtValue(newValue || '')}
              onInputChange={(event, newInputValue) => setExtValue(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add External Tags"
                  placeholder="Add External Tags"
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
              Add
            </Button>
          </Box>
          {errors.extTags && <Alert severity="error">{errors.extTags.message}</Alert>}
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
        <Field.SingelSelect
          checkbox
          name="material"
          label="Material"
          options={ARTWORK_MATERIAL_OPTIONS}
        />
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          <Field.Text name="height" label="Height (in cm)" />
          <Field.Text name="width" label="Width (in cm)" />
          <Field.Text name="lenght" label="Depth (in cm)" />
          <Field.Text name="weight" label="Weight (in kg)" />
        </Box>
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
          <Field.Text name="frameHeight" label="Frame Height (in cm)" />
          <Field.Text name="frameWidth" label="Frame Width (in cm)" />
          <Field.Text name="frameLenght" label="Frame Depth (in cm)" />
        </Box>
        <Field.SingelSelect
          checkbox
          name="artworkOrientation"
          label="Artwork Orientation"
          options={ARTWORK_ORIENTATION_OPTIONS}
        />
      </Stack>
    </Card>
  );

  const Commercialization = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Commercialization" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <FormControl fullWidth component="fieldset">
          <FormLabel component="legend">Commercialization Options</FormLabel>
          <RadioGroup
            name="activeTab"
            sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              methods.setValue('artistFees', '');
              methods.setValue('subscriptionCatalog', '');
              methods.setValue('purchaseCatalog', '');
            }}
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
              name="subscriptionCatalog"
              label="Subscription Catalog"
              onClick={(e: any) => handleChange(e)}
              options={
                mongoDBId
                  ? artworkData?.subscriptionCatalog
                    ? artworkData?.subscriptionCatalog.map((i) => ({
                        value: i._id,
                        artistFees: i.artistFees,
                        label: i.catalogName,
                      }))
                    : [
                        {
                          value: '',
                          label: 'No Catalog Found',
                        },
                      ]
                  : [
                      {
                        value: '',
                        label: 'Search For Artist First',
                      },
                    ]
              }
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
              name="purchaseCatalog"
              onClick={(e: any) => handleChange(e)}
              label="Purchase Catalog"
              options={
                mongoDBId
                  ? artworkData?.purchaseCatalog
                    ? artworkData?.purchaseCatalog.map((i) => ({
                        value: i._id,
                        artistFees: i.artistFees,
                        label: i.catalogName,
                      }))
                    : [
                        {
                          value: '',
                          label: 'No Catalog Found',
                        },
                      ]
                  : [
                      {
                        value: '',
                        label: 'Search For Artist First',
                      },
                    ]
              }
            />
            <Field.SingelSelect
              checkbox
              name="purchaseType"
              label="Purchase Type"
              options={purOption ? purOption : []}
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
      {selectedOption === 'purchase' ? (
        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.SingelSelect
            required
            sx={{ minWidth: 150 }}
            name="currency"
            label="Currency"
            options={currency ? currency : []}
          />
          {fixPrice === 'Price By Request' ||
          fixPrice === 'Fixed Price' ||
          fixPrice === 'Downward Offer' ? (
            <>
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
                <Field.Text
                  name="dpersentage"
                  label="Discount Percentage"
                  placeholder="0.00%"
                  type="number"
                />
              </Stack>
            </>
          ) : null}
          {fixPrice === 'Downward Offer' || fixPrice === 'Upward Offer' ? (
            <Field.Text name="acceptOfferPrice" label="Accept offer min. price" />
          ) : null}
          <Field.Text
            type="number"
            value={methods.getValues('vatAmount')}
            name="vatAmount"
            label="VAT Amount (%)"
            InputLabelProps={{ shrink: true }}
          />
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
      ) : (
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
              options={currency ? currency : []}
            />
          </Stack>
          <Field.Text
            name="dpersentage"
            label="Discount Percentage"
            placeholder="0.00%"
            type="number"
          />

          <Field.Text
            type="number"
            value={methods.getValues('vatAmount')}
            InputLabelProps={{ shrink: true }}
            name="vatAmount"
            label="VAT Amount (%)"
          />
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
      )}
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
        <Field.SingelSelect
          name="packageMaterial"
          label="Package Material"
          options={packMaterial ? packMaterial : []}
        />
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="packageHeight" label="Package Height (in cm)" />
          <Field.Text name="packageWidth" label="Package Width (in cm)" />
          <Field.Text name="packageLength" label="Package Depth (in cm)" />
        </Box>
        <Field.Text name="packageWeight" label="Package Weight (in Kg)" />
        <Field.Checkbox name="commingSoon" label="Comming Soon" />
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
        <Box>
          <Typography gutterBottom>Promotion Score : {slide}</Typography>
          {slide ? (
            <Slider
              name="promotionScore"
              label="Promotion Score"
              marks={marks}
              defaultValue={slide}
              size="medium"
              getAriaValueText={(val) => valuetext(val)}
              aria-label="Promotion Score"
              valueLabelDisplay="auto"
            />
          ) : (
            <Slider
              name="promotionScore"
              label="Promotion Score"
              marks={marks}
              defaultValue={slide}
              size="medium"
              getAriaValueText={(val) => valuetext(val)}
              aria-label="Promotion Score"
              valueLabelDisplay="auto"
            />
          )}
        </Box>
      </Stack>
    </Card>
  );

  const Restrictions = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Restrictions" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          name="availableTo"
          label="Available To"
          options={availableTo ? availableTo : []}
        />
        <Field.SingelSelect
          name="discountAcceptation"
          label="Discount Acceptation"
          options={discountAcceptation ? discountAcceptation : []}
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
          disabled
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
      {addSeriesDialogBox}
    </Form>
  );
}
