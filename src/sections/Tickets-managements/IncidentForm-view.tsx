import type { IPostItem } from 'src/types/blog';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
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
    INC_GROUP_OPTIONS,
    INC_TYPE_OPTIONS,
    INC_SEVERITY_OPTIONS,
    INC_STATUS_OPTIONS,
} from "src/_mock"
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';


// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
    incGroup: zod.string().min(1, { message: 'group is required!' }),
    incType: zod.string().min(1, { message: 'Type is required!' }),
    title: zod.string().min(1, { message: 'Title is required!' }),
    description: schemaHelper.editor().min(100, { message: 'Description must be at least 100 characters' }),
    date: schemaHelper.date({ message: { required_error: 'date is required!' } }),
    initTime: schemaHelper.time({ message: { required_error: 'time is required!' } }),
    endTime: schemaHelper.time({ message: { required_error: 'time is required!' } }),
    severity: zod.string().min(1, { message: 'Severity is required!' }),
    status: zod.string().min(1, { message: 'Status is required!' }),
    note: zod.string(),
  
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddIncidentForm({ currentPost }: Props) {
  const router = useRouter();

  const preview = useBoolean();

  const defaultValues = useMemo(
    () => ({
      incGroup: currentPost?.incGroup || '',
      incType: currentPost?.incType || '',
      title:currentPost?.title || '',
      description:currentPost?.description || '',
      date: currentPost?.date || null,
      initTime: currentPost?.initTime || null,
      severity: currentPost?.severity || '',
      status: currentPost?.status || '',
      note:currentPost?.note || '',
    
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
  
  
  
  const renderDetails = (
    <Card>

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>

        <Field.SingelSelect 
         checkbox
         name="incGroup"
         label="Inc. Group"
         options={INC_GROUP_OPTIONS}
        />
        <Field.SingelSelect 
         checkbox
         name="incType"
         label="Inc. Type"
         options={INC_TYPE_OPTIONS}
        />
        
        <Field.Text name="title" label="Title" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Description</Typography>
          <Field.Editor name="description" sx={{ maxHeight: 480 }} />
        </Stack>
 
        <Field.MobileDateTimePicker name='date' label='Incident Date & Time'/>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
         <Field.TimePicker name='initTime' label='Init Time'/>

         <Field.TimePicker name='endTime' label='End Time'/>

        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
            <Field.SingelSelect 
         checkbox
         name="severity"
         label="Severity"
         options={INC_SEVERITY_OPTIONS}
        />
        <Field.SingelSelect 
         checkbox
         name="status"
         label="Status"
         options={INC_STATUS_OPTIONS}
        />
        </Box>
        
        <Field.Text name='note' label='Note' multiline rows={4}/>
      </Stack>
    </Card>
  );


  

  return (
    <div>
        <CustomBreadcrumbs
        heading="New Incident"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          // { name: 'KB Database', href: paths.dashboard.kbdatabase.Root},
          { name: 'Add Incident' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
   
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5}> 
       <div className='grid grid-cols-3 gap-3'>

        <div className='col-span-2'>
        {renderDetails}
        <div className='flex flex-row justify-start gap-3 mt-8'>
        <button type='button' className='bg-white text-black border py-2 px-3 rounded-md'>Cencel</button>
        <button type='submit' className='bg-black text-white py-2 px-3 rounded-md'>Save</button>
      </div>
        </div>

        <div className='col-span-1'>
        
        </div>
        </div>
       
      </Stack>

      
    </Form>
    </div>
  );
}
