import type { IPostItem } from 'src/types/blog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { Art_provider, ArtworkList, Collections } from 'src/_mock';

import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { CATAGORY_EXCLUSIVE_OPTIONS, CATAGORY_PLAN_OPTIONS } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  // group: zod.string().min(1, { message: 'group is required!' }),
  name: zod.string().min(1, { message: 'name is required!' }),
  description: zod.string().min(1, { message: ' Description is required!' }),
  artworkList: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  collections: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  provider: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  isActive: zod.boolean(),
  plan: zod.string().min(1, { message: 'plan is required!' }),
  exclusive: zod.string().min(1, { message: 'Exclusive Catalog is required!' }),
  image: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddCatalogForm({ currentPost }: Props) {
  const router = useRouter();

  const preview = useBoolean();

  const defaultValues = useMemo(
    () => ({
      //   group: currentPost?.group || '',
      name: currentPost?.name || '',
      description: currentPost?.description || '',
      artworkList: currentPost?.artworkList || [],
      collections: currentPost?.collections || [],
      provider: currentPost?.provider || [],
      isActive: currentPost?.description || true,
      plan: currentPost?.plan || '',
      exclusive: currentPost?.exclusive || '',
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

  const renderDetails = (
    <Card>
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Catalog Name" />

        <Field.Text name="description" label="Catalog Discription" multiline rows={4} />

        <Field.Autocomplete
          name="artworkList"
          label="Artwork List"
          placeholder="+ list"
          multiple
          freeSolo
          disableCloseOnSelect
          options={ArtworkList.map((option) => option)}
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
        <Field.Autocomplete
          name="collections"
          label="Collections"
          placeholder="+ list"
          multiple
          freeSolo
          disableCloseOnSelect
          options={Collections.map((option) => option)}
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
        <Field.Autocomplete
          name="provider"
          label="Art provider"
          placeholder="+ Art"
          multiple
          freeSolo
          disableCloseOnSelect
          options={Art_provider.map((option) => option)}
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

        <Field.Switch
          name="isActive"
          labelPlacement="start"
          label="public"
          sx={{ mx: 0, width: 1, justifyContent: 'flex' }}
        />
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Thumbnail" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <div>
            <Typography>Photo</Typography>
            <Field.Upload name="image" maxSize={3145728} onDelete={handleRemoveMainImage} />
          </div>
        </Stack>
      </Stack>
    </Card>
  );

  const subscription = (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Subscription Plan" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="plan"
          label="Subscription Plan"
          options={CATAGORY_PLAN_OPTIONS}
        />
      </Stack>
    </Card>
  );

  const exclusive = (
    <Card>
      <CardHeader title="Exclusive Catalog" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="exclusive"
          label="Exclusive Catalog"
          options={CATAGORY_EXCLUSIVE_OPTIONS}
        />
      </Stack>
    </Card>
  );

  return (
    <div>
      <CustomBreadcrumbs
        heading="Add Catalog"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          // { name: 'FAQ', href: paths.dashboard.faq.Root},
          { name: 'Add Catalog' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          <div className="grid grid-cols-3  gap-3">
            <div className="col-span-1">
              {renderProperties}
              {subscription}
              {exclusive}
            </div>
            <div className="col-span-2">
              {renderDetails}
              <div className="flex flex-row justify-end gap-3 mt-8">
                <button type="button" className="bg-white text-black border py-2 px-3 rounded-md">
                  Cencel
                </button>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  Save{' '}
                </button>
              </div>
            </div>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
