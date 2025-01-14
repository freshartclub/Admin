import { CardHeader, Stack } from '@mui/material';
import { Divider } from '@mui/material';
import { Typography } from '@mui/material';
import { Chip } from '@mui/material';
import { Card } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { schemaHelper } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { _tags } from 'src/_mock';
import { useNavigate } from 'react-router';
import useAddCircle from './http/useAddCircle';
import { useSearchParams } from 'src/routes/hooks';
import { toast } from 'sonner';
import { useGetCircleById } from './http/useGetCircleById';
import { LoadingScreen } from 'src/components/loading-screen';

type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  content: schemaHelper.editor().min(100, { message: 'Content must be at least 100 characters' }),
  backImage: schemaHelper.file({ message: { required_error: 'Cover Photo is required!' } }),
  mainImage: schemaHelper.file({ message: { required_error: 'Main Photo is required!' } }),
  categories: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  managers: zod.string().array().min(1, { message: 'Must assign at least 1 Manager!' }),
});

const AddCircle = () => {
  const navigate = useNavigate();
  const id = useSearchParams().get('id');

  const { data, isLoading } = useGetCircleById(id);

  const defaultValues = useMemo(
    () => ({
      title: data?.title || '',
      description: data?.description || '',
      content: data?.content || '',
      backImage: data?.backImage || null,
      mainImage: data?.mainImage || null,
      categories: data?.categories || [],
      managers: data?.managers || [],
    }),
    [data]
  );
  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;
  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const { mutate, isPending } = useAddCircle(id);

  const handleBackRemoveFile = () => {
    methods.setValue('backImage', null);
  };

  const handleMainRemoveFile = () => {
    methods.setValue('mainImage', null);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      if (!data.mainImage) {
        toast.error('Main Photo is required');
        return;
      }
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('content', data.content);
      formData.append('backImage', data.backImage);
      formData.append('mainImage', data.mainImage);
      formData.append('categories', JSON.stringify(data.categories));
      formData.append('managers', JSON.stringify(data.managers));

      mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Title, short description, image..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title" label="Circle Title" />

        <Field.Text name="description" label="Circle Description" multiline rows={3} />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Content</Typography>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Main Photo</Typography>
          <Field.Upload name="mainImage" maxSize={3145728} onDelete={handleMainRemoveFile} />
        </Stack>

        <Field.Autocomplete
          name="categories"
          label="Categories"
          placeholder="+ Categories"
          multiple
          freeSolo
          disableCloseOnSelect
          options={[]}
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
          name="managers"
          label="Assign Managers"
          placeholder="+ Assign Managers"
          multiple
          freeSolo
          disableCloseOnSelect
          options={[]}
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

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Cover</Typography>
          <Field.Upload name="backImage" maxSize={3145728} onDelete={handleBackRemoveFile} />
        </Stack>
      </Stack>
    </Card>
  );

  if (id && isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <CustomBreadcrumbs
        heading="Add Circle"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add Circle' }]}
        sx={{ mb: 3 }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          {renderDetails}{' '}
          <div className="flex justify-end gap-2">
            <span
              onClick={() => navigate(paths.dashboard.category.discipline.list)}
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
    </>
  );
};

export default AddCircle;
