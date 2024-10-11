import type { IPostItem } from 'src/types/blog';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback, useState } from 'react';

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

import { _tags, _restriction,
  COUPON_USEGE_OPTIONS,
  COUPON_SUBSCRIPTIONPLAN_OPTIONS,
  _catalog,
  COUPON_EXTENTION_OPTIONS,
  COUPON_DISCOUNT_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
 
import {
    FAQ_GROUP_OPTIONS,
} from "src/_mock"
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Checkbox, FormGroup, Radio, RadioGroup } from '@mui/material';


// ----------------------------------------------------------------------
const SUBTASKS = [
  'Subscription',
  'Direct Purchase',
];
export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
    code: zod.string().min(1, { message: 'code is required!' }),
    name: zod.string().min(1, { message: 'Name is required!' }),
    note: zod.string().min(1, { message: 'Discount Note is required!' }),
    validFrom: schemaHelper.date({ message: { required_error: 'date is required!' } }),
    validTo: schemaHelper.date({ message: { required_error: 'date is required!' } }),
    images: schemaHelper.file({ message: { required_error: 'Images is required!' } }),
    restriction: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
    usage: zod.string().min(1, { message: 'Usage is required!' }),
    subscriptionPlan: zod.string().min(1, { message: 'Plan is required!' }),
    catalog: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
    minAmount: zod.string().min(1, { message: 'Amount is required!' }),
    extension: zod.string().min(1, { message: 'Extension is required!' }),
    discount: zod.string().min(1, { message: 'discount is required!' }),
    disAmount: zod.string().min(1, { message: 'discount is required!' }),
   
    
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddCouponForm({ currentPost }: Props) {
  // const [value, setValue] = useState(true)
  const router = useRouter();
  

  const preview = useBoolean();

  const defaultValues = useMemo(
    () => ({
      code: currentPost?.code || '',
      name:currentPost?.name || '',
      note:currentPost?.note || '',
      validFrom: currentPost?.validFrom || null,
      validTo: currentPost?.validTo || null,
      images: currentPost?.images || [],
      restriction: currentPost?.restriction || [],
      usage:currentPost?.usage || '',
      subscriptionPlan:currentPost?.subscriptionPlan || '',
      catalog: currentPost?.catalog || [], 
      minAmount:currentPost?.minAmount||  '',
      extension:currentPost?.extension||  '',
      discount:currentPost?.discount||  '',
      disAmount:currentPost?.disAmount||  '',

    }),
    [currentPost]
  );

  const methods = useForm<NewPostSchemaType>({
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
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

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

  
  const renderDetails = (
    <Card>

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>

        
        <Field.Text name="code" label="Discount Code" />
        
        <Field.Text name="name" label="Discount Name" />

        <Field.Text name="faqQuestion" label="Faq Question" />

        <Field.Text name="note" label="Discount Note" multiline rows={4} />
        
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

        <Field.DatePicker name="validFrom" label="ValidFrom" />

        <Field.DatePicker name="validTo" label="ValidTo" />

        <Field.Autocomplete
          name="restriction"
          label="Restrictions"
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
        <Field.SingelSelect 
         checkbox
         name="usage"
         label="Usage"
         options={COUPON_USEGE_OPTIONS}
        />
        <Field.SingelSelect 
         checkbox
         name="subscriptionPlan"
         label="For Subsciption Plan"
         options={COUPON_SUBSCRIPTIONPLAN_OPTIONS}
        />

        <Field.Autocomplete
          name="catalog"
          label="Choose Catalog"
          placeholder="+ Catalog"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_catalog.map((option) => option)}
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
      <CardHeader title="BENEFITS " sx={{mb:1}}/>

      <Field.Text name='minAmount' label='Minimum Amount'/>
     
      <Field.SingelSelect 
         checkbox
         name="extension"
         label="Subscription Extension"
         options={COUPON_EXTENTION_OPTIONS}
        /> 

        <Field.SingelSelect 
         checkbox
         name="discount"
         label="Discount Percentage"
         options={COUPON_DISCOUNT_OPTIONS}
        />        
        <Field.Text name='disAmount' label='Discount Amount'/>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <Divider />
       <Stack spacing={3} sx={{ p: 3 }}>
       <Stack spacing={1.5}>
       <Typography variant="subtitle2">images</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFileDetails}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
          <FormGroup>
        
      </FormGroup>
        </Stack>
       </Stack>
    </Card>
  );

  

  return (
    <div>
        <CustomBreadcrumbs
        heading="Coupon & Promotion"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Coupon & Promotions', href: paths.dashboard.couponandpromotions.Root},
          { name: 'Add' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
   
    <Form methods={methods} onSubmit={onSubmit}>
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
        </div>
        </div>
       
      </Stack>

      
    </Form>
    </div>
  );
}
