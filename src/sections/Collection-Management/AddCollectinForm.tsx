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

import { _tags,ArtworkList,Collections,Art_provider,_artworks  } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
 
import {
    COLLECTION_TAGS_OPTIONS,COLLECTION_STATUS_OPTIONS,COLLECTION_CREATED_OPTIONS
} from "src/_mock"
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { fData } from 'src/utils/format-number';


// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
    // group: zod.string().min(1, { message: 'group is required!' }),
    name: zod.string().min(1, { message: 'name is required!' }),
    collectionDescription: schemaHelper.editor().min(100, { message: 'Description must be at least 100 characters' }),
    date: schemaHelper.date({ message: { required_error: 'date is required!' } }),
    created: zod.string().min(1, { message: ' Creatar is required!' }),
    artworks: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
    avatarUrl: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
    expertsDescription: zod.string().min(1, { message: ' Description is required!' }),
    images: schemaHelper.file({ message: { required_error: 'Images is required!' } }),

    description: zod.string().min(1, { message: ' Description is required!' }),
    // artworkList: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
    // collections: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
    // provider: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
    // isActive: zod.boolean(),
    tags: zod.string().min(1, { message: 'Artwork Tags is required!' }),
    status: zod.string().min(1, { message: 'status is required!' }),
    image: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
   
  
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddCollectionForm({ currentPost }: Props) {
  const router = useRouter();

  const preview = useBoolean();

  const defaultValues = useMemo(
    () => ({
    //   group: currentPost?.group || '',
      name:currentPost?.name || '',
      collectionDescription: currentPost?.collectionDescription || '',
      date: currentPost?.date || null,
      created: currentPost?.created || '',
      artworks: currentPost?.artworks || [],
      avatarUrl: currentPost?.avatarUrl || null,
      expertsDescription: currentPost?.expertsDescription || '',
      images: currentPost?.images || [],

      description:currentPost?.description || '',
    //   artworkList: currentPost?.artworkList || [], 
    //   collections: currentPost?.collections  || [], 
    //   provider: currentPost?.provider  || [], 
    //   isActive: currentPost?.description || true,
      tags:currentPost?.tags || '',
      status:currentPost?.status || '',
      image: currentPost?.image || null,
     
      
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
  
  const handleRemoveMainImage = useCallback(() => {
    setValue('image', null);
  }, [setValue]);

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
     <CardHeader title='General Information' sx={{ mb: 1 }}/>
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>

        <Field.Text name="name" label="Collection Name" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Collection Description</Typography>
          <Field.Editor name="collectionDescription" sx={{ maxHeight: 480 }} />
        </Stack>    

        <Field.DatePicker name="date" label="Creation Date" />

        <Field.SingelSelect 
         checkbox
         name="created"
         label="Created By"
         options={COLLECTION_CREATED_OPTIONS}
        />
          
          <Field.Autocomplete
          name="artworks"
          label="Select Artworks"
          placeholder="+ list"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_artworks.map((option) => option)}
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
        <Field.Text name="description" label="Small Discription" multiline rows={4} />
                
            <Typography variant="subtitle2">Experts Details</Typography>
               <div className='mb-3 border border-gray-200 rounded-md p-4'>
               
                  <Field.UploadAvatar
                    name="avatarUrl"
                    maxSize={3145728}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 3,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.disabled',
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                </div>

            <Field.Text name="expertsDescription" label="Experts Discription" multiline rows={4} />

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
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card sx={{mb:2}}>
      <CardHeader title='Thumbnail' sx={{mb:1}}/>
      <Divider />
       <Stack spacing={3} sx={{ p: 3 }}>
       <Stack spacing={1.5}>
          <div>
            <Typography variant="Image">Photo</Typography>
            <Field.Upload name="image" maxSize={3145728} onDelete={handleRemoveMainImage} />
          </div>
        </Stack>
       </Stack>
    </Card>
  );
  
  const subscription = (
    <Card sx={{mb:2}}>
      <CardHeader title='Artwork Tags' sx={{mb:1}}/>
      <Divider />
       <Stack spacing={3} sx={{ p: 3 }}>
       <Field.SingelSelect 
         checkbox
         name="tags"
         label="Artwork Tags"
         options={COLLECTION_TAGS_OPTIONS}
        />
       </Stack>
    </Card>
  );

  const exclusive = (
    <Card>
      <CardHeader title='Status of Collections' sx={{mb:1}}/>
      <Divider />
       <Stack spacing={3} sx={{ p: 3 }}>
       <Field.SingelSelect 
         checkbox
         name="status"
         label="Artwork Status"
         options={COLLECTION_STATUS_OPTIONS}
        />
       </Stack>
    </Card>
  );
  

  return (
    <div>
        <CustomBreadcrumbs
        heading="Add Collection"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
        //   { name: 'Artwork', href: paths.dashboard.artwork.Root},
          { name: 'Add Collection' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
   
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5}> 
       <div className='grid grid-cols-3  gap-3'>
         
       
        <div className='col-span-2'>
        {renderDetails}
        <div className='flex flex-row justify-end gap-3 mt-8'>
        <button type='button' className='bg-white text-black border py-2 px-3 rounded-md'>Cencel</button>
        <button type='submit' className='bg-black text-white py-2 px-3 rounded-md'>Save </button>
      </div>
        </div>
        
        <div className='col-span-1'>

        {subscription}
        {renderProperties}
        
        {exclusive}
        </div>
        
        </div>
       
      </Stack>

      
    </Form>
    </div>
  );
}
