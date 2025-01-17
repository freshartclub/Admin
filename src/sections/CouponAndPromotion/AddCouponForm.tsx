import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import { Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { _restriction } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetAllCatalog } from 'src/http/createArtist/useGetAllCatalog';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { imgUrl } from 'src/utils/BaseUrls';
import { useGetAllPlans } from '../Subscription-Plans/http/useGetAllPlans';
import useAddCoupon from './http/useAddCoupon';
import { useGetCouponById } from './http/useGetCouponById';

// ----------------------------------------------------------------------

type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  code: zod.string().min(1, { message: 'code is required!' }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  note: zod.string().min(1, { message: 'Discount Note is required!' }),
  validFrom: schemaHelper.date({ message: { required_error: 'Valid From Date is required!' } }),
  validTo: schemaHelper.date({ message: { required_error: 'Valid To Date is required!' } }),
  restriction: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  usage: zod.number().min(1, { message: 'Usage is required!' }),
  subscriptionPlan: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  catalogs: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  extension: zod.number().min(1, { message: 'Extension is required!' }),
  discount: zod.number().min(1, { message: 'Discount Percentage is required!' }),
  disAmount: zod.number().min(1, { message: 'Discount Amount is required!' }),
});

// ----------------------------------------------------------------------

export function AddCouponForm() {
  const navigate = useNavigate();
  const id = useSearchParams().get('id');

  const { data: catalogData } = useGetAllCatalog();
  const { data: planData } = useGetAllPlans();

  const { data, isLoading } = useGetCouponById(id);

  const defaultValues = useMemo(
    () => ({
      code: data?.code || '',
      name: data?.name || '',
      note: data?.note || '',
      validFrom: data?.validFrom || null,
      validTo: data?.validTo || null,
      restriction: data?.restriction || [],
      usage: data?.usage || 0,
      subscriptionPlan: data?.subscriptionPlan || [],
      catalogs: data?.catalogs || [],
      // minAmount: data?.minAmount || '',
      extension: data?.extension || 0,
      discount: data?.discount || 0,
      disAmount: data?.disAmount || 0,
    }),
    [data]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;
  const values = watch();

  useEffect(() => {
    if (data) {
      reset(defaultValues);
    }
  }, [data]);

  const { mutate, isPending } = useAddCoupon(id);

  const onSubmit = handleSubmit(async (data) => {
    mutate(data);
  });

  if (isLoading) return <LoadingScreen />;

  const renderDetails = (
    <Card>
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text required name="code" label="Coupon Code" />
        <Field.Text required name="name" label="Coupon Name" />
        <Field.Text required name="note" label="Coupon Note" multiline rows={4} />

        <Field.DatePicker required name="validFrom" label="Valid From *" />
        <Field.DatePicker required name="validTo" label="Valid To *" />

        <Field.Autocomplete
          required
          name="restriction"
          label="Restrictions *"
          placeholder="+ Restrict"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_restriction.map((option) => option)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
        <Field.Text type="number" required name="usage" label="Coupon Usage" />

        <Field.Autocomplete
          fullWidth
          required
          name="subscriptionPlan"
          label="Select Subscription Plan *"
          placeholder="Select Subscription Plan"
          multiple
          disableCloseOnSelect
          options={
            planData && planData.length > 0
              ? planData.map((item) => ({
                  _id: item._id,
                  planGrp: item.planGrp,
                  planName: item.planName,
                  planImg: item.planImg,
                }))
              : []
          }
          getOptionLabel={(option) => option.planName}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderOption={(props, option) => (
            <Stack {...props} key={option._id} spacing={1} direction="row">
              <Avatar alt={option?.planName} src={`${imgUrl}/users/${option?.planImg}`} />
              <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                <Box component="span">{option.planName}</Box>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {option.planGrp}
                </Box>
              </Stack>
            </Stack>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={index}
                label={option.planName}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
          onChange={(event, value) => {
            const selectedIds = value.map((item) => item._id);
            setValue('subscriptionPlan', selectedIds);
          }}
          value={
            planData && planData.length > 0
              ? planData.filter((item) => watch('subscriptionPlan')?.includes(item._id))
              : []
          }
        />

        <Field.Autocomplete
          fullWidth
          name="catalogs"
          required
          label="Select Catalogs *"
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
        <CardHeader title="BENEFITS" sx={{ mb: 1 }} />

        <Field.Text required type="number" name="extension" label="Subscription Extension" />
        <Field.Text required type="number" name="discount" label="Discount Percentage" />
        <Field.Text required type="number" name="disAmount" label="Discount Amount" />
      </Stack>
    </Card>
  );

  return (
    <div>
      <CustomBreadcrumbs
        heading="Coupon & Promotion"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add' }]}
        sx={{ mb: 3 }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          {renderDetails}
          <div className="flex justify-end gap-2">
            <span
              onClick={() => navigate(paths.dashboard.couponandpromotions.list)}
              className="px-3 py-2 text-white bg-black rounded-md cursor-pointer"
            >
              Cancel
            </span>
            <button
              disabled={isPending}
              type="submit"
              className="px-3 py-2 text-white bg-black rounded-md"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
