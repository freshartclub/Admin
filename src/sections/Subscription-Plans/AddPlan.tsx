import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Avatar, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import { PLAN_NUMOFARTWORK_OPTIONS, PLAN_SHIPMENTS_OPTIONS, PLAN_STATUS_OPTIONS } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetAllCatalog } from 'src/http/createArtist/useGetAllCatalog';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { imgUrl } from 'src/utils/BaseUrls';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';
import useAddPlan from './http/useAddPlan';
import { useGetPlanById } from './http/useGetPlanById';

type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  planGrp: zod.string().min(1, { message: 'Group is required!' }),
  planName: zod.string().min(1, { message: 'Name is required!' }),
  planDesc: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  standardPrice: zod.number().min(0, { message: 'Standard Price is required!' }),
  standardYearlyPrice: zod.number().min(0, { message: 'Standard Yearly Price is required!' }),
  catalogs: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  currentPrice: zod.number().min(0, { message: 'Current Price is required!' }),
  currentYearlyPrice: zod.number().min(0, { message: 'Current Yearly Price is required!' }),
  defaultArtistFees: zod.number().min(0, { message: 'Default Artist Fees are required!' }),
  numArtworks: zod.number().min(0, { message: 'Number of Artworks is required!' }),
  numLargeArtworks: zod.number().min(0, { message: 'Number of Large Artworks is required!' }),
  individualShipment: zod.boolean({ message: 'Individual Shipment is required!' }),
  logCarrierSubscription: zod.string().min(1, { message: 'Log Carrier Subscription is required!' }),
  logCarrierPurchase: zod.string().min(1, { message: 'Log Carrier Purchase is required!' }),
  purchaseDiscount: zod.string().min(1, { message: 'Purchase Discount is required!' }),
  limitPurchaseDiscount: zod.string().min(1, { message: 'Limit Purchase Discount is required!' }),
  monthsDiscountSubscription: zod
    .number()
    .min(0, { message: 'Months Discount Subscription is required!' }),
  planImg: schemaHelper.file({ message: { required_error: 'Plan Image is required!' } }),
  status: zod.string().min(1, { message: 'Status is required!' }),
  defaultPlan: zod.boolean().optional(),
  planData: zod.array(
    zod.object({
      length: zod.number().min(1, { message: 'Length is required!' }),
      width: zod.number().min(1, { message: 'Width is required!' }),
      height: zod.number().min(1, { message: 'Height is required!' }),
      minSubTime: zod.number().min(1, { message: 'Minimum Subscription Time is required!' }),
    })
  ),
});

// ----------------------------------------------------------------------

export function AddPlanForm() {
  const navigate = useNavigate();
  const id = useSearchParams().get('id');

  const { data, isLoading } = useGetPlanById(id);
  const plans = RenderAllPicklist('Plans');
  const { data: catalogData } = useGetAllCatalog();

  const defaultValues = useMemo(
    () => ({
      planGrp: data?.planGrp || '',
      planName: data?.planName || '',
      planDesc: data?.planDesc || '',
      catalogs: data?.catalogs || [],
      standardPrice: data?.standardPrice || 0,
      standardYearlyPrice: data?.standardYearlyPrice || 0,
      currentPrice: data?.currentPrice || 0,
      currentYearlyPrice: data?.currentYearlyPrice || 0,
      defaultArtistFees: data?.defaultArtistFees || 0,
      numArtworks: data?.numArtworks || 5,
      numLargeArtworks: data?.numLargeArtworks || 5,
      individualShipment: data?.individualShipment || false,
      logCarrierSubscription: data?.logCarrierSubscription || '',
      logCarrierPurchase: data?.logCarrierPurchase || '',
      purchaseDiscount: data?.purchaseDiscount || '',
      limitPurchaseDiscount: data?.limitPurchaseDiscount || '',
      monthsDiscountSubscription: data?.monthsDiscountSubscription || 5,
      planImg: data?.planImg || null,
      status: data?.status || '',
      defaultPlan: data?.defaultPlan || false,
      planData: data?.planData || [{ length: '', width: '', height: '', minSubTime: '' }],
    }),
    [data]
  );

  const formProps = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = formProps;
  const values = watch();

  useEffect(() => {
    if (data) {
      const updatedData = {
        ...data,
        planImg: data.planImg ? `${imgUrl}/users/${data.planImg}` : null,
      };
      reset(updatedData);
    }
  }, [data]);

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: 'planData',
  });

  const handleRemove = (index) => {
    remove(index);
  };

  const haddCv = () => {
    append({
      length: 0,
      width: 0,
      height: 0,
      minSubTime: 0,
    });
  };

  const { mutate, isPending } = useAddPlan(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key] = JSON.stringify(data[key]);
        }
        formData.append(key, data[key]);
      });

      await mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFile = () => {
    setValue('planImg', null);
  };

  if (isLoading) return <LoadingScreen />;

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect name="planGrp" options={plans ? plans : []} label="Plan Group" />
        <Field.Text name="planName" label="Plan Name" />

        <Stack spacing={1}>
          <Typography variant="subtitle2">
            Commercial Description (Please use "Bullet Point" format for "List")
          </Typography>
          <Field.Editor name="planDesc" sx={{ maxHeight: 480 }} />
        </Stack>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text type="number" name="standardPrice" label="Standard Price" />
          <Field.Text type="number" name="standardYearlyPrice" label="Yearly Standard Price" />
          <Field.Text type="number" name="currentPrice" label="Current Price" />
          <Field.Text type="number" name="currentYearlyPrice" label="Yearly Current Price" />
        </Box>

        <Field.Text type="number" name="defaultArtistFees" label="Default Artist Fees" />

        <Field.SingelSelect
          type="number"
          name="numArtworks"
          label="Number of Artworks Included in Subscription"
          options={PLAN_NUMOFARTWORK_OPTIONS}
        />
        <Field.SingelSelect
          type="number"
          name="numLargeArtworks"
          label="Number of Large Format Artworks Allowed"
          options={PLAN_NUMOFARTWORK_OPTIONS}
        />
        <Field.SingelSelect
          name="individualShipment"
          label="Individual Shipments"
          options={PLAN_SHIPMENTS_OPTIONS}
        />
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="logCarrierSubscription" label="Default Log Carrier in Subscriptions" />
          <Field.Text name="logCarrierPurchase" label="Default Log Carrier in Purchase" />
        </Box>
        <Field.Text name="purchaseDiscount" label="Purchase Discount in Included Catalogs" />

        <Field.Text
          name="limitPurchaseDiscount"
          label="Monthly Limit for Purchase Discount (Artworks)"
        />

        <Field.SingelSelect
          type="number"
          name="monthsDiscountSubscription"
          label="#Months to Be Discounted on Subscription Purchase Option"
          options={PLAN_NUMOFARTWORK_OPTIONS}
        />

        {fields.map((item, index) => (
          <Stack key={item.id} spacing={1.5}>
            <Box
              columnGap={2}
              rowGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
            >
              <Field.Text type="number" name={`planData[${index}].length`} label="Depth (cm)" />
              <Field.Text type="number" name={`planData[${index}].width`} label="Width (cm)" />
              <Field.Text type="number" name={`planData[${index}].height`} label="Height (cm)" />
              <Field.Text
                type="number"
                name={`planData[${index}].minSubTime`}
                label="Min. Subscription Times (Months)"
              />
            </Box>

            <Button
              size="small"
              color="error"
              className="flex justify-end"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            >
              Remove
            </Button>
          </Stack>
        ))}
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={haddCv}
        >
          Add Row
        </Button>
        <Field.Checkbox name="defaultPlan" label="Main/Default Plan in Group" />
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Select Catalogs" />

      <Stack spacing={2} alignItems="center" direction="row" sx={{ p: 2 }}>
        <Field.Autocomplete
          fullWidth
          name="catalogs"
          required
          label="Select Catalogs"
          placeholder="Select Catalogs"
          multiple
          disableCloseOnSelect
          options={
            catalogData && catalogData.length > 0
              ? catalogData.map((item) => ({
                  _id: item._id,
                  catalogName: item.catalogName,
                  catalogImg: item.catalogImg,
                }))
              : []
          }
          getOptionLabel={(option) => option.catalogName}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderOption={(props, option) => (
            <div className="flex items-center gap-4" {...props} key={option._id}>
              <Avatar alt={option?.catalogName} src={`${imgUrl}/users/${option?.catalogImg}`} />
              <span className="ml-2">{option.catalogName}</span>
            </div>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={index}
                label={option.catalogName}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
          onChange={(event, value) => {
            const selectedIds = value.map((item) => item._id);
            setValue('catalogs', selectedIds);
          }}
          value={
            catalogData && catalogData.length > 0
              ? catalogData.filter((item) => watch('catalogs')?.includes(item._id))
              : []
          }
        />
      </Stack>
    </Card>
  );

  const media = (
    <Card sx={{ mb: 3 }}>
      <Divider />
      <CardHeader title="Image" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Upload name="planImg" maxSize={3145728} onDelete={handleRemoveFile} />
      </Stack>
    </Card>
  );

  const status = (
    <Card sx={{ mb: 3 }}>
      <Divider />
      <CardHeader title="Status" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Field.SingelSelect name="status" label="Status" options={PLAN_STATUS_OPTIONS} />
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <div>
      <CustomBreadcrumbs
        heading="Subscription Plan"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Add Subscription', href: paths.dashboard.subscriptionplan.add },
        ]}
        sx={{ mb: 3 }}
      />

      <FormProvider {...formProps}>
        <form onSubmit={onSubmit}>
          <Stack spacing={5}>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                {renderDetails}
                <div className="flex flex-row justify-end gap-3 mt-8">
                  <span
                    onClick={() => navigate(paths.dashboard.subscriptionplan.list)}
                    className="bg-white text-black border py-2 px-3 rounded-md cursor-pointer"
                  >
                    Cancel
                  </span>
                  <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                    {isPending ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="col-span-1">
                {renderProperties}
                {media}
                {status}
              </div>
            </div>
          </Stack>
        </form>
      </FormProvider>
    </div>
  );
}
