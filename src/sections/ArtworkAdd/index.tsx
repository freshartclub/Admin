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
  ARTWORK_PROMOTIONSCORE_OPTIONS,
  ARTWORK_PURCHASECATALOG_OPTIONS,
  ARTWORK_STYLE_OPTIONS,
  ARTWORK_TAGES_OPTIONS,
  ARTWORK_UPWORKOFFER_OPTIONS,
  PRODUCT_SERIES_OPTIONS,
  PRODUCT_YEARS_OPTIONS,
} from 'src/_mock';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@mui/material';
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

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  artworkName: zod.string().min(1, { message: 'Artwork Name is required!' }),
  artistID: zod.string().min(1, { message: 'Artist ID is required!' }),
  artistName: zod.string().min(1, { message: 'artistName is required!' }),
  artworkCreationYear: zod.string().min(1, { message: 'Artwork Creation Year is required!' }),
  artworkSeries: zod.string().min(1, { message: 'Artwork Series is required!' }),
  productDescription: zod.string().optional(),
  mainImage: schemaHelper.file({ message: { required_error: 'Main Photo is required!' } }),
  backImage: schemaHelper.file({ required: false }).optional(),
  inProcessImage: schemaHelper.file({ required: false }).optional(),
  images: zod.array(schemaHelper.file({ required: false })).optional(),
  mainVideo: schemaHelper.file({ required: false }).optional(),
  otherVideo: schemaHelper.file({ required: false }).optional(),
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
  frameHeight: zod.string().min(1, { message: 'Hight required!' }),
  frameLenght: zod.string().min(1, { message: 'Lenght required!' }),
  frameWidth: zod.string().min(1, { message: 'Width required!' }),
  artworkStyle: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  emotions: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  colors: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  purchaseCatalog: zod.string().min(1, { message: 'Purchase Catalog required!' }),
  artistFees: zod.string().min(1, { message: 'Artist Fees required!' }),
  downwardOffer: zod.string().optional(),
  upworkOffer: zod.string().optional(),
  acceptOfferPrice: zod.string().min(1, { message: 'Accept offer price is required!' }),
  priceRequest: zod.string().optional(),
  basePrice: zod.string().min(1, { message: 'Base price is required!' }),
  dpersentage: zod.string().min(1, { message: 'Descount not be $0.00' }),
  vatAmount: zod.string().optional(),
  artistbaseFees: zod.string().optional(),
  sku: zod.string().min(1, { message: 'sku is required!' }),
  pCode: zod.string().optional(),
  location: zod.string().min(1, { message: 'location is required!' }),
  artworkDiscipline: zod.string(),
  artworkTags: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  promotion: zod.string().optional(),
  promotionScore: zod.string().optional(),
  availableTo: zod.string().optional(),
  discountAcceptation: zod.string().optional(),
  collectionList: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function ArtworkAdd({ currentProduct }) {
  const { data: disciplineData } = useGetDisciplineMutation();
  const { data: technicData } = useGetTechnicMutation();
  const { data: themeData } = useGetThemeListMutation();

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

  const defaultValues = useMemo(
    () => ({
      artworkName: data?.artworkName || '',
      artistID: data?.owner?.artistId || '',
      artistName: data?.owner?.artistName || '',
      artworkCreationYear: data?.artworkCreationYear || '',
      artworkSeries: data?.artworkSeries || ' ',
      productDescription: data?.productDescription || '',

      mainImage: data?.mainImage || null,
      backImage: data?.backImage || null,
      inProcessImage: data?.inProcessImage || null,
      images: data?.images || [],
      mainVideo: data?.mainVideo || null,
      otherVideo: data?.otherVideo || null,

      artworkTechnic: data?.additionalInfo?.artworkTechnic || '',
      artworkTheme: data?.additionalInfo?.artworkTheme || '',
      artworkOrientation: data?.additionalInfo?.artworkOrientation || '',
      material: data?.additionalInfo?.material || '',
      weight: data?.additionalInfo?.weight || '',
      lenght: data?.additionalInfo?.length || '',
      height: data?.additionalInfo?.height || '',
      width: data?.additionalInfo?.width || '',
      hangingAvailable: data?.additionalInfo?.hangingAvailable || '',
      hangingDescription: data?.additionalInfo?.hangingDescription || ' ',
      framed: data?.additionalInfo?.framed || '',
      framedDescription: data?.additionalInfo?.framedDescription || ' ',
      frameHeight: data?.additionalInfo?.frameHeight || '',
      frameLenght: data?.additionalInfo?.frameLength || '',
      frameWidth: data?.additionalInfo?.frameWidth || '',
      artworkStyle: data?.additionalInfo?.artworkStyle || [],
      emotions: data?.additionalInfo?.emotions || [],
      colors: data?.additionalInfo?.colors || [],
      purchaseCatalog: data?.commercialization?.purchaseCatalog || '',
      downwardOffer: data?.commercialization?.downwardOffer || '',
      upworkOffer: data?.commercialization?.upworkOffer || '',
      acceptOfferPrice: data?.commercialization?.acceptOfferPrice || '',
      priceRequest: data?.commercialization?.priceRequest || '',

      basePrice: data?.pricing?.basePrice || '',
      dpersentage: data?.pricing?.dpersentage || '',
      vatAmount: data?.pricing?.vatAmount || '',
      artistFees: data?.pricing?.artistFees || '',
      offensive: data?.offensive || '',
      artistbaseFees: data?.commercialization?.artistbaseFees || '',

      sku: data?.inventoryShipping?.sku || '',
      pCode: data?.inventoryShipping?.pCode || '',
      location: data?.inventoryShipping?.location || '',
      artworkDiscipline: data?.discipline?.artworkDiscipline || '',
      artworkTags: data?.discipline?.artworkTags || [],
      promotion: data?.promotions?.promotion || '',
      promotionScore: data?.promotions?.promotionScore || '',
      availableTo: data?.restriction?.availableTo || '',
      discountAcceptation: data?.restriction?.discountAcceptation || '',
      collectionList: data?.collectionList || '',
    }),
    [data]
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
    formState: { isSubmitting, errors },
  } = methods;

  const selectedDisciplines = useWatch({
    control: methods.control,
    name: 'artworkDiscipline',
  });

  const debounceArtistId = useDebounce(methods.getValues('artistID'), 500);

  const { refetch, data: artistData } = useGetArtistById(debounceArtistId);
  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (methods.getValues('artistID') !== '') {
      refetch();
    }
  }, [debounceArtistId]);

  useEffect(() => {
    if (data && !isLoading) {
      reset(defaultValues);
    }
  }, [data, isLoading]);

  const onSubmit = handleSubmit(async (data) => {
    try {
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
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
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

  const handleRemoveFileotherVideo = useCallback(() => {
    setValue('otherVideo', null);
  }, [setValue]);

  const refillData = (artistData) => {
    setValue('artistID', artistData?.artistId);
    setValue('artistName', artistData?.artistName);
    setmongoDBId(artistData?._id);
    setOpen(false);
  };

  const filterTechnicForDiscipline = (selectedDiscipline) => {
    return TechnicArr.filter((style) => style.disciplineName.includes(selectedDiscipline));
  };

  const filterThemeForDiscipline = (selectedDiscipline) => {
    return ThemeArr.filter((style) => style.disciplineName.includes(selectedDiscipline));
  };

  const renderDetails = (
    <Card sx={{ mb: 3, position: 'relative' }}>
      <CardHeader title="General Informations" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <div className="relative">
          <Field.Text name="artistID" label="Artist ID" />
          {methods.getValues('artistID') && open && (
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
                        <Avatar alt={'heyy'}>{i?.avatar}</Avatar>

                        <ListItemText
                          disableTypography
                          primary={
                            <Typography variant="body2" noWrap>
                              {i?.artistName} - {i?.userId}
                            </Typography>
                          }
                          secondary={
                            <Link
                              noWrap
                              variant="body2"
                              // onClick={onViewRow}
                              sx={{ color: 'text.disabled' }}
                            >
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
        <Field.Text name="artistName" label=" Artist Name" />
        <Field.Text name="artworkName" label=" Artwork Name" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.SingelSelect
            checkbox
            name="artworkCreationYear"
            label="Artwork Creation year"
            options={PRODUCT_YEARS_OPTIONS}
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
            multiple
            accpet="image/*"
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFileDetails}
            onRemoveAll={handleRemoveAllFiles}
            // onUpload={() => console.info('ON UPLOAD')}
          />
        </div>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <div>
            <Typography>Main Video</Typography>
            <Field.MultiVideo name="mainVideo" maxSize={5e7} onDelete={handleRemoveFileVideo} />
          </div>
          <div>
            <Typography>Other Video</Typography>
            <Field.MultiVideo
              name="otherVideo"
              maxSize={5e7}
              onDelete={handleRemoveFileotherVideo}
            />
          </div>
        </Box>
      </Stack>
    </Card>
  );

  const additionalInformation = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Additional Information" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
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
            // options={ARTWORK_TECHNIC_OPTIONS}
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
            // options={ARTWORK_THEME_OPTIONS}
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
            label="material"
            options={ARTWORK_MATERIAL_OPTIONS}
          />

          <Field.SingelSelect
            checkbox
            name="offensive"
            label="offensive"
            options={ARTWORK_OFFENSIVE_OPTIONS}
          />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          <Field.Text name="weight" label="weight" />
          <Field.Text name="height" label="height" />
          <Field.Text name="lenght" label="lenght" />
          <Field.Text name="width" label="width" />
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
          label="framed"
          options={ARTWORK_FRAMED_OPTIONS}
        />
        <Field.Text name="framedDescription" label="framed Description" multiline rows={3} />
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="frameHeight" label="Height" />
          <Field.Text name="frameLenght" label="Lenght" />
          <Field.Text name="frameWidth" label="Width" />
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
          label="emotions"
          options={ARTWORK_EMOTIONS_OPTIONS}
        />
        <Field.MultiSelect checkbox name="colors" label="colors" options={ARTWORK_COLORS_OPTIONS} />
      </Stack>
    </Card>
  );

  const Commercialization = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Commercialization" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="purchaseCatalog"
          label="Purchase Catalog"
          options={ARTWORK_PURCHASECATALOG_OPTIONS}
        />
        <Field.Text name="artistFees" label="Artist Fees" />
        <Field.SingelSelect
          checkbox
          name="downwardOffer"
          label="Downward Offer"
          options={ARTWORK_DOWNWARDOFFER_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="upworkOffer"
          label="Upwork Offer"
          options={ARTWORK_UPWORKOFFER_OPTIONS}
        />
        <Field.Text name="acceptOfferPrice" label="Accept offer min. price" />
        <Field.SingelSelect
          checkbox
          name="priceRequest"
          label="Price by request"
          options={ARTWORK_UPWORKOFFER_OPTIONS}
        />
      </Stack>
    </Card>
  );
  const pricing = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="pricing" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="basePrice" label="Base Price" />
        {/* <Field.Text name="dpersentage" label="Discounted Percentage" /> */}
        <Field.Text
          name="dpersentage"
          label="Discounted Percentage"
          placeholder="0.00%"
          // type="number"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  $
                </Box>
              </InputAdornment>
            ),
          }}
        />
        {/* <Field.Text name="Discounte " label="Discounted Percentage " /> */}
        <Field.Text name="vatAmount" label="VAT Amount (%)" />
        <Field.Text name="artistbaseFees" label="Artist Fees" />
      </Stack>
    </Card>
  );
  const InventoryandShiping = (
    <Card>
      <CardHeader title="InventoryandShiping" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="sku" label="sku" />
          <Field.Text name="pCode" label="Product code" />
          <Field.Text name="location" label="location" />
        </Box>
      </Stack>
    </Card>
  );
  const Discipline = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Discipline" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="artworkDiscipline"
          label="Artwork Discipline"
          options={PRODUCT_CATAGORYONE_OPTIONS}
        />
        <Field.MultiSelect
          checkbox
          name="artworkTags"
          label="Artwork Tags"
          options={ARTWORK_TAGES_OPTIONS}
        />
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
          label="promotion"
          options={ARTWORK_PROMOTIONS_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="promotionScore"
          label="promotion Score"
          options={ARTWORK_PROMOTIONSCORE_OPTIONS}
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
    <div>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="col-span-2">
              {renderDetails}
              {media}
              {additionalInformation}
              {Commercialization}
              {pricing}
              {InventoryandShiping}
            </div>

            <div className="col-span-1">
              {Discipline}
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
    </div>
  );
}
