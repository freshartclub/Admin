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

import { _tags, _userTages } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
 
import {
    FAQ_GROUP_OPTIONS,
    MASSAGE_TYPE_OPTIONS,
} from "src/_mock"
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';


// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({

   fromUser: zod.string().min(1, { message: 'user is required!' }),
   toUser: zod.string().min(1, { message: 'user is required!' }),
   userTags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
   fromArtist: zod.string().min(1, { message: 'Artist is required!' }),
   toArtist: zod.string().min(1, { message: 'Artist is required!' }),
   artistTags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
   date: schemaHelper.date({ message: { required_error: 'date is required!' } }),
   msgType: zod.string().min(1, { message: 'Type is required!' }),
   title: zod.string().min(1, { message: 'Title is required!' }),
   description: schemaHelper.editor().min(100, { message: 'Description must be at least 100 characters' }),
  
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddMessageForm({ currentPost }: Props) {
  const router = useRouter();

  const preview = useBoolean();

  const defaultValues = useMemo(
    () => ({
      fromUser: currentPost?.fromUser || '',
      ToUser:currentPost?.ToUser || '',
      userTags: currentPost?.userTags || [],
      fromArtist: currentPost?.fromArtist || '',
      ToArtist:currentPost?.ToArtist || '',
      artistTags: currentPost?.artistTags || [],
      date: currentPost?.date || null,
      msgType:currentPost?.msgType || '',
      title: currentPost?.title || '',
      description:currentPost?.description || '',
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
      
      <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
         <Field.Text name="fromUser" label="From User" />
         <Field.Text name="toUser" label="To User" />
         <Field.Autocomplete
          name="userTags"
          label="User Tags"
          placeholder="+ Tags"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_userTages.map((option) => option)}
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
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
         <Field.Text name="fromArtist" label="From Artist" />
         <Field.Text name="toArtist" label="To Artist" />
         <Field.Autocomplete
          name="artistTags"
          label="Artist Tags"
          placeholder="+ Tags"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_userTages.map((option) => option)}
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
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
            <Field.DatePicker name='date' label='Schedule massage'/>

            <Field.SingelSelect 
            checkbox
            name="msgType"
            label="Massage Type"
            options={MASSAGE_TYPE_OPTIONS}
            />
        </Box>
        
        <Field.Text name="title" label="Title" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Description</Typography>
          <Field.Editor name="description" sx={{ maxHeight: 480 }} />
        </Stack>
        
      </Stack>
    </Card>
  );

  

  

  return (
    <div>
        <CustomBreadcrumbs
        heading="New Message"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          // { name: 'KB Database', href: paths.dashboard.kbdatabase.Root},
          { name: 'Add Message' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
   
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5}> 
       
        {renderDetails}
        <div className='flex flex-row justify-start gap-3 mt-8'>
        <button type='button' className='bg-white text-black border py-2 px-3 rounded-md'>Cencel</button>
        <button type='submit' className='bg-black text-white py-2 px-3 rounded-md'>Save</button>
      </div>
       

        
       
      </Stack>

      
    </Form>
    </div>
  );
}
