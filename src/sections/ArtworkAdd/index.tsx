import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { InputAdornment, Typography } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  PRODUCT_YEARS_OPTIONS,
  ARTWORK_THEME_OPTIONS,
  ARTWORK_STYLE_OPTIONS,
  ARTWORK_TAGES_OPTIONS,
  PRODUCT_series_OPTIONS,
  ARTWORK_FRAMED_OPTIONS,
  ARTWORK_COLORS_OPTIONS,
  ARTWORK_TECHNIC_OPTIONS,
  ARTWORK_HANGING_OPTIONS,
  ARTWORK_EMOTIONS_OPTIONS,
  ARTWORK_MATERIAL_OPTIONS,
  ARTWORK_OFFENSIVE_OPTIONS,
  ARTWORK_DISCIPLINE_OPTIONS,
  ARTWORK_PROMOTIONS_OPTIONS,
  ARTWORK_UPWORKOFFER_OPTIONS,
  ARTWORK_AVAILABLETO_OPTIONS,
  ARTWORK_ORIENTATION_OPTIONS,
  ARTWORK_DOWNWARDOFFER_OPTIONS,
  ARTWORK_PROMOTIONSCORE_OPTIONS,
  ARTWORK_COLLECTIONLIST_OPTIONS,
  ARTWORK_PURCHASECATALOG_OPTIONS,
  ARTWORK_DISCOUNTACCEPTATION_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  ArtworkName: zod.string().min(1, { message: 'Artwork Name is required!' }),
  ArtistID: zod.string().min(1, { message: 'Artist ID is required!' }),
  ArtistName: zod.string().min(1, { message: 'ArtistName is required!' }),
  ArtworkCreationYear: zod.string().min(1, { message: 'Artwork Creation Year is required!' }),
  ArtworkSeries: zod.string().min(1, { message: 'Artwork Series is required!' }),
  ProductDescription: zod.string(),

  MainPhoto: schemaHelper.file({ message: { required_error: 'Main Photo is required!' } }),
  BackPhoto: schemaHelper.file({ message: { required_error: 'Back Photo is required!' } }),
  InprocssPhoto: schemaHelper.file({ message: { required_error: 'Inprocess Photo is required!' } }),
  images: schemaHelper.files({ message: { required_error: 'Images is required!' } }),
  MainVideo: schemaHelper.file({ message: { required_error: 'Main Video is required!' } }),
  otherVideo: schemaHelper.file({ message: { required_error: 'other Video is required!' } }),

  ArtworkTechnic: zod.string().min(1, { message: 'Artwork Technic is required!' }),
  ArtworkTheme: zod.string().min(1, { message: 'ArtworkTheme is required!' }),
  ArtworkOrientation: zod.string().min(1, { message: 'Artwork Orientation is required!' }),
  Material: zod.string().min(1, { message: 'Material is required!' }),
  Weight: zod.string().min(1, { message: 'Weight required!' }),
  Hight: zod.string().min(1, { message: 'Hight required!' }),
  Lenght: zod.string().min(1, { message: 'Lenght required!' }),
  Width: zod.string().min(1, { message: 'Width required!' }),
  HangingAvailable: zod.string().min(1, { message: 'Hanging Available required!' }),
  HangingDescription: zod.string(),
  Framed: zod.string().min(1, { message: 'Framed is required!' }),
  FramedDescription: zod.string(),
  FrameHight: zod.string().min(1, { message: 'Hight required!' }),
  FrameLenght: zod.string().min(1, { message: 'Lenght required!' }),
  FrameWidth: zod.string().min(1, { message: 'Width required!' }),
  ArtworkStyle: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  Emotions: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  Colors: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  PurchaseCatalog: zod.string().min(1, { message: 'Purchase Catalog required!' }),
  ArtistFees: zod.string().min(1, { message: 'Artist Fees required!' }),
  DownwardOffer: zod.string(),
  UpworkOffer: zod.string(),
  AcceptOfferPrice: zod.string().min(1, { message: 'Accept offer price is required!' }),
  PriceRequest: zod.string(),
  BasePrice: zod.string().min(1, { message: 'Base price is required!' }),
  Dpersentage: zod.number().min(1, { message: 'Descount not be $0.00' }),
  VATAmount: zod.string(),
  ArtistbaseFees: zod.string(),
  SKU: zod.string().min(1, { message: 'SKU is required!' }),

  PCode: zod.string(),

  Location: zod.string().min(1, { message: 'Location is required!' }),
  ArtworkDiscipline: zod.string(),
  ArtworkTags: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  Promotion: zod.string(),
  PromotionScore: zod.string(),
  AvailableTo: zod.string(),
  DiscountAcceptation: zod.string(),
  CollectionList: zod.string(),
});

// ----------------------------------------------------------------------

export function ArtworkAdd({ currentProduct }) {
  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      ArtworkName: currentProduct?.ArtworkName || 'Monalisa',
      ArtistID: currentProduct?.ArtistID || 'XZH6546',
      ArtistName: currentProduct?.ArtistName || 'Rachit Patel',
      ArtworkCreationYear: currentProduct?.ArtworkCreationYear || '2021',
      ArtworkSeries: currentProduct?.ArtworkSeries || 'Catagog 1',
      ProductDescription: currentProduct?.ProductDescription || 'LoremLroem',

      MainPhoto: currentProduct?.MainPhoto || null,
      BackPhoto: currentProduct?.BackPhoto || null,
      InprocessPhoto: currentProduct?.InprocessPhoto || null,
      images: currentProduct?.images || [],
      MainVideo: currentProduct?.MainVideo || null,
      otherVideo: currentProduct?.otherVideo || null,

      ArtworkTechnic: currentProduct?.ArtworkTechnic || 'Painting',
      ArtworkTheme: currentProduct?.ArtworkTheme || '',
      ArtworkOrientation: currentProduct?.ArtworkOrientation || 'Square',
      Material: currentProduct?.Material || '',
      Weight: currentProduct?.Weight || '20kg',
      Hight: currentProduct?.Hight || '400Cm',
      Lenght: currentProduct?.Lenght || '20m',
      Width: currentProduct?.Width || '10m',
      HangingAvailable: currentProduct?.HangingAvailable || '',
      HangingDescription: currentProduct?.HangingDescription || 'Lorem Lorem',
      Framed: currentProduct?.Framed || '',
      FramedDescription: currentProduct?.FramedDescription || 'Lorem Lorem',
      FrameHight: currentProduct?.FrameHight || '20m',
      FrameLenght: currentProduct?.FrameLenght || '400cm',
      FrameWidth: currentProduct?.FrameWidth || '20vw',
      ArtworkStyle: currentProduct?.ArtworkStyle || [],
      Emotions: currentProduct?.Emotions || [],
      Colors: currentProduct?.Colors || [],
      PurchaseCatalog: currentProduct?.PurchaseCatalog || '',
      ArtistFees: currentProduct?.ArtistFees || '$5000',
      DownwardOffer: currentProduct?.ArtistFees || '',
      UpworkOffer: currentProduct?.UpworkOffer || '',
      AcceptOfferPrice: currentProduct?.AcceptOfferPrice || '',
      PriceRequest: currentProduct?.PriceRequest || '',

      BasePrice: currentProduct?.BasePrice || '',
      Dpersentage: currentProduct?.Dpersentage || 0,
      VATAmount: currentProduct?.VATAmount || '',
      ArtistbaseFees: currentProduct?.ArtistbaseFees || '',

      SKU: currentProduct?.SKU || '',
      PCode: currentProduct?.PCode || '',
      Location: currentProduct?.Location || '',
      ArtworkDiscipline: currentProduct?.ArtworkDiscipline || '',
      ArtworkTags: currentProduct?.ArtworkTags || [],
      Promotion: currentProduct?.Promotion || '',
      PromotionScore: currentProduct?.PromotionScore || '',
      AvailableTo: currentProduct?.AvailableTo || '',
      DiscountAcceptation: currentProduct?.DiscountAcceptation || '',
      CollectionList: currentProduct?.CollectionList || '',
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      console.info('DATA', data);
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

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const handleRemoveFileone = useCallback(() => {
    setValue('BackPhoto', null);
  }, [setValue]);

  const handleRemoveFile = useCallback(() => {
    setValue('MainPhoto', null);
  }, [setValue]);

  const handleRemoveFiletwo = useCallback(() => {
    setValue('InprocessPhoto', null);
  }, [setValue]);

  const handleRemoveFileVideo = useCallback(() => {
    setValue('MainVideo', null);
  }, [setValue]);
  const handleRemoveFileotherVideo = useCallback(() => {
    setValue('otherVideo', null);
  }, [setValue]);

  const renderDetails = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="General Informations" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="ArtistID" label=" Artist ID" />
        <Field.Text name="ArtistName" label=" Artist Name" />
        <Field.Text name="ArtworkName" label=" Artwork Name" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.SingelSelect
            checkbox
            name="ArtworkCreationYear"
            label="Artwork Creation year"
            options={PRODUCT_YEARS_OPTIONS}
          />
          <Field.SingelSelect
            checkbox
            name="ArtworkSeries"
            label="Artwork Series"
            options={PRODUCT_series_OPTIONS}
          />
        </Box>

        <Field.Text name="ProductDescription" label="Product Description" multiline rows={4} />

        {/* end my section */}
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
            <Typography variant="MainPhoto">Main Photo</Typography>
            <Field.Upload name="MainPhoto" maxSize={3145728} onDelete={handleRemoveFile} />
          </div>

          <div>
            <Typography variant="BackPhoto">Back Photo</Typography>
            <Field.Upload name="BackPhoto" maxSize={3145728} onDelete={handleRemoveFileone} />
          </div>

          <div>
            <Typography variant="InprocessPhoto">Inprocess Photo</Typography>
            <Field.Upload name="InprocessPhoto" maxSize={3145728} onDelete={handleRemoveFiletwo} />
          </div>
        </Box>
        <div>
          <Typography variant="subtitle2">Details Photos</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFileDetails}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </div>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <div>
            <Typography variant="MainVideo">Main Video</Typography>
            <Field.MultiVideo name="MainVideo" maxSize={5e7} onDelete={handleRemoveFileVideo} />
          </div>
          <div>
            <Typography variant="otherVideo">Main Video</Typography>
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
            checkbox
            name="ArtworkTechnic"
            label="Artwork Technic"
            options={ARTWORK_TECHNIC_OPTIONS}
          />

          <Field.SingelSelect
            checkbox
            name="ArtworkTheme"
            label="Artwork Theme"
            options={ARTWORK_THEME_OPTIONS}
          />
        </Box>
        <Field.SingelSelect
          checkbox
          name="ArtworkOrientation"
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
            name="Material"
            label="Material"
            options={ARTWORK_MATERIAL_OPTIONS}
          />

          <Field.SingelSelect
            checkbox
            name="Offensive"
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
          <Field.Text name="Weight" label="Weight" />
          <Field.Text name="Hight" label="Hight" />
          <Field.Text name="Lenght" label="Lenght" />
          <Field.Text name="Width" label="Width" />
        </Box>
        <Field.SingelSelect
          checkbox
          name="HangingAvailable"
          label="Hanging available"
          options={ARTWORK_HANGING_OPTIONS}
        />
        <Field.Text name="HangingDescription" label="Hanging Description" multiline rows={3} />
        <Field.SingelSelect
          checkbox
          name="Framed"
          label="Framed"
          options={ARTWORK_FRAMED_OPTIONS}
        />
        <Field.Text name="FramedDescription" label="Framed Description" multiline rows={3} />
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="FrameHight" label="Hight" />
          <Field.Text name="FrameLenght" label="Lenght" />
          <Field.Text name="FrameWidth" label="Width" />
        </Box>
        <Field.MultiSelect
          checkbox
          name="ArtworkStyle"
          label="Artwork Style"
          options={ARTWORK_STYLE_OPTIONS}
        />
        <Field.MultiSelect
          checkbox
          name="Emotions"
          label="Emotions"
          options={ARTWORK_EMOTIONS_OPTIONS}
        />
        <Field.MultiSelect checkbox name="Colors" label="Colors" options={ARTWORK_COLORS_OPTIONS} />
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
          name="PurchaseCatalog"
          label="Purchase Catalog"
          options={ARTWORK_PURCHASECATALOG_OPTIONS}
        />
        <Field.Text name="ArtistFees" label="Artist Fees" />
        <Field.SingelSelect
          checkbox
          name="DownwardOffer"
          label="Downward Offer"
          options={ARTWORK_DOWNWARDOFFER_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="UpworkOffer"
          label="Upwork Offer"
          options={ARTWORK_UPWORKOFFER_OPTIONS}
        />
        <Field.Text name="AcceptOfferPrice" label="Accept offer min. price" />
        <Field.SingelSelect
          checkbox
          name="PriceRequest"
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
        <Field.Text name="BasePrice" label="Base Price" />
        {/* <Field.Text name="Dpersentage" label="Discounted Percentage" /> */}
        <Field.Text
          name="Dpersentage"
          label="Discounted Percentage"
          placeholder="0.00%"
          type="number"
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
        <Field.Text name="VATAmount" label="VAT Amount (%)" />
        <Field.Text name="ArtistbaseFees" label="Artist Fees" />
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
          <Field.Text name="SKU" label="SKU" />
          <Field.Text name="PCode" label="Product code" />
          <Field.Text name="Location" label="Location" />
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
          name="ArtworkDiscipline"
          label="Artwork Discipline"
          options={ARTWORK_DISCIPLINE_OPTIONS}
        />
        <Field.MultiSelect
          checkbox
          name="ArtworkTags"
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
          name="Promotion"
          label="Promotion"
          options={ARTWORK_PROMOTIONS_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="PromotionScore"
          label="Promotion Score"
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
          name="AvailableTo"
          label="AvailableTo"
          options={ARTWORK_AVAILABLETO_OPTIONS}
        />
        <Field.SingelSelect
          checkbox
          name="DiscountAcceptation"
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
          name="CollectionList"
          label="Collection List"
          options={ARTWORK_COLLECTIONLIST_OPTIONS}
        />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create product' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

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
          {/* {renderActions} */}
          <div className="flex justify-end mb-6 mr-6">
            <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
              Save
            </button>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
