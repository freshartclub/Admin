import type { IPostItem } from 'src/types/blog';

import { z as zod } from 'zod';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';


import { useBoolean } from 'src/hooks/use-boolean';

import { _tags } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
 
import {
    PLAN_NUMOFARTWORK_OPTIONS,
    PLAN_SHIPMENTS_OPTIONS,
    PLAN_STATUS_OPTIONS,

} from "src/_mock"
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Checkbox } from '@mui/material';
import { Iconify } from 'src/components/iconify';


const SUBTASKS = [
    'CAtalog 01',
    'CAtalog 02',
    'CAtalog 03',
    'CAtalog 04',
    'CAtalog 05',
    'CAtalog 06',
  ];
// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
    group: zod.string().min(1, { message: 'group is required!' }),
    name: zod.string().min(1, { message: 'Name is required!' }),
    CDescription: schemaHelper.editor().min(100, { message: 'Description must be at least 100 characters' }),
    standardPrice: zod.string().min(1, { message: 'Price is required!' }),
    yearlyPrice: zod.string().min(1, { message: 'Price is required!' }),
    currentPrice: zod.string().min(1, { message: 'Price is required!' }),
    yearlyCurrentPrice: zod.string().min(1, { message: 'Price is required!' }),
    artistFees: zod.string().min(1, { message: 'Fees is required!' }),
    numOfArtwork: zod.string().min(1, { message: 'Number of Artwork is required!' }),
    numOfLargeArtwork: zod.string().min(1, { message: 'Number of Artwork is required!' }),
    shipments: zod.string().min(1, { message: 'shipments is required!' }),
    logCarrierSubscription: zod.string().min(1, { message: 'Log Subscription is required!' }),
    logCarrierPurchase: zod.string().min(1, { message: 'Log Purchase is required!' }),
    purchaseDiscount: zod.string().min(1, { message: 'Discount is required!' }),
    limitPurchaseDiscount: zod.string().min(1, { message: 'Discount Limit is required!' }),
    discountSubscriptin: zod.string().min(1, { message: 'Discount  is required!' }),
    goupImage: schemaHelper.file({ message: { required_error: 'Images is required!' } }),
    planStatus: zod.string().min(1, { message: 'status is required!' }),
    planData: zod.array(
        zod.object({
          size: zod.string().min(1, { message: 'size is required!' }),
          minSubscriptionTime: zod.string().min(1, { message: 'min Subscription time is required!' }),
          
        })
      ),


//    images: schemaHelper.file({ message: { required_error: 'Images is required!' } }),
//   tags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddPlanForm({ currentPost }: Props) {
  const router = useRouter();

  const preview = useBoolean();

  const defaultValues = useMemo(
    () => ({
      group: currentPost?.group || '',
      name:currentPost?.title || '',
      CDescription:currentPost?.CDescription || '',
      standardPrice: currentPost?.standardPrice || '',
      yearlyPrice: currentPost?.yearlyPrice || '',
      artistFees: currentPost?.artistFees || '',
      numOfArtwork: currentPost?.numOfArtwork || '',
      numOfLargeArtwork: currentPost?.numOfLargeArtwork || '',
      shipments: currentPost?.shipments || '',
      logCarrierSubscription: currentPost?.logCarrierSubscription || '',
      logCarrierPurchase: currentPost?.logCarrierPurchase || '',
      purchaseDiscount: currentPost?.purchaseDiscount || '',
      limitPurchaseDiscount: currentPost?.limitPurchaseDiscount || '',
      discountSubscriptin: currentPost?.discountSubscriptin || '',
      goupImage:currentPost?.goupImage || null,
      planStatus: currentPost?.goupImage || '',
    //   planData: currentPost?.planData || '',


      images: currentPost?.images || [],
    //   tags: currentPost?.tags || [],
      
    }),
    [currentPost]
  );

  const formProps = useForm<NewPostSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = formProps;
  
  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const { fields, append, remove } = useFieldArray({ control: formProps.control, name: 'planData' });

  const handleRemove = (index) => {
    remove(index);
  };

  const haddCv = () => {
    append({
      size: '',
      minSubscriptionTime: '',
     
    });
  };
  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      preview.onFalse();
      toast.success(currentPost ? 'Update success!' : 'Create success!');
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
 
  const handleRemoveFile = useCallback(() => {
    setValue('goupImage', null);
  }, [setValue]);
  
  const renderDetails = (
    <Card>

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>

        {/* <Field.SingelSelect 
         checkbox
         name="group"
         label="select Group"
         options={FAQ_GROUP_OPTIONS}
        /> */}
        <Field.Text name="group" label="Plan Group" />
        
        <Field.Text name="name" label="Plan Name" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Commercial Description</Typography>
          <Field.Editor name="CDescription" sx={{ maxHeight: 480 }} />
        </Stack>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
            <Field.Text name="standardPrice" label="Standard Price" />

            <Field.Text name="yearlyPrice" label="Yearly Standard Price" />

            <Field.Text name="currentPrice" label="Current Price" />

            <Field.Text name="yearlyCurrentPrice" label="Yearly Current Price" />
        </Box>

        <Field.Text name="artistFees" label="Default Artist Fees" />
  
        <Field.SingelSelect 
         checkbox
         name="numOfArtwork"
         label="Number of Artworks included in subscription"
         options={PLAN_NUMOFARTWORK_OPTIONS}
        />
        <Field.SingelSelect 
         checkbox
         name="numOfLargeArtwork"
         label="Number of large format artworks allowed"
         options={PLAN_NUMOFARTWORK_OPTIONS}
        />
        <Field.SingelSelect 
         checkbox
         name="shipments"
         label="Individual Shipments"
         options={PLAN_SHIPMENTS_OPTIONS}
        />
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
             <Field.Text name="logCarrierSubscription" label="Default log carrier in subscriptions" />

             <Field.Text name="logCarrierPurchase" label="Default log carrier in Purchase" />

        </Box>
        <Field.Text name="purchaseDiscount" label="Purchase discount in included catalogs" />

        <Field.Text name="limitPurchaseDiscount" label="Monthly limit for Purchase Discount (Artworks)" />
   
        <Field.SingelSelect 
         checkbox
         name="discountSubscriptin"
         label="#Months to be discounted on Subscription Purchase Option"
         options={PLAN_NUMOFARTWORK_OPTIONS}
        />


       {/* try start */}
       {fields.map((item, index) => (
            <Stack
              key={item.id}
              aligncvs={{ xs: 'flex-center', md: 'flex-end' }}
              spacing={1.5}
              className=""
            >
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              >
              
              <Field.Text name={`planData[${index}].size`} label="Size (WxHxD)" />
                <Field.Text name={`planData[${index}].minSubscriptionTime`} label="Min. Subscription Times (months)​" />
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
            Add row
          </Button>
          
               
        {/* try end */}

        {/* <Field.Autocomplete
          name="tags"
          label="Tags"
          placeholder="+ Tags"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
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
        /> */}
        
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card sx={{mb: 3}}>
      <Divider />
      <CardHeader title='Catalog'/>
       <Stack spacing={3} sx={{ p: 3 }}>
       <Stack spacing={1.5}>
          <Typography variant="subtitle2">choose catalogs</Typography>
          {SUBTASKS.map((taskItem) => (
          <FormControlLabel
            key={taskItem}
            control={
              <Checkbox
                disableRipple
                name={taskItem}
                // checked={subtaskCompleted.includes(taskItem)}
              />
            }
            label={taskItem}
            // onChange={() => handleClickSubtaskComplete(taskItem)}
          />
        ))}
        </Stack>
       </Stack>
    </Card>
  );
 
  const media = (
    <Card sx={{mb: 3}}>
      <Divider />
      <CardHeader title='Icon'/>
       <Stack spacing={3} sx={{ p: 3 }}>
       <Stack spacing={1.5}>
          <Typography variant="subtitle2">Image</Typography>
           <Field.Upload name="goupImage" maxSize={3145728} onDelete={handleRemoveFile} />
        </Stack>
       </Stack>
    </Card>
  );
  
  const status = (
    <Card sx={{mb: 3}}>
      <Divider />
      <CardHeader title='Status of Plan'/>
       <Stack spacing={3} sx={{ p: 3 }}>
       <Stack spacing={1.5}>
       <Field.SingelSelect 
         checkbox
         name="planStatus"
         label="Status"
         options={PLAN_STATUS_OPTIONS}
        />
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
          { name: 'Add Subscription', href: paths.dashboard.subscriptionplan.add},
        //   { name: 'Add KB' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />


      <FormProvider {...formProps}>
    <form onSubmit={onSubmit}>
      <Stack spacing={5}> 
       <div className='grid grid-cols-3 gap-3'>

        <div className='col-span-2'>
        {renderDetails}
        <div className='flex flex-row justify-end gap-3 mt-8'>
        <button type='button' className='bg-white text-black border py-2 px-3 rounded-md'>Cencel</button>
        <button type='submit' className='bg-black text-white py-2 px-3 rounded-md'>Save</button>
      </div>
        </div>

        <div className='col-span-1'>
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
