import { zodResolver } from '@hookform/resolvers/zod';
import { CardHeader, Divider } from '@mui/material';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { _tags } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';
import useAddVisualize from './http/useAddVisualize';
import { useGetVisualizeById } from './http/useGetVisualizeById';
import { imgUrl } from 'src/utils/BaseUrls';

// ----------------------------------------------------------------------

type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

const NewPostSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  group: zod.string().min(1, { message: 'Group is required!' }),
  image: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
  dimension_weight: zod.string().min(1, { message: 'Dimension Weight is required!' }),
  dimension_height: zod.string().min(1, { message: 'Dimension Height is required!' }),
  area_x1: zod.string().min(1, { message: 'Area X1 is required!' }),
  area_y1: zod.string().min(1, { message: 'Area Y1 is required!' }),
  area_x2: zod.string().min(1, { message: 'Area X2 is required!' }),
  area_y2: zod.string().min(1, { message: 'Area Y2 is required!' }),
  tags: zod.string().array().optional(),
});

// ----------------------------------------------------------------------

export function AddVisualize() {
  const id = useSearchParams().get('id') as string;

  const { data, isLoading } = useGetVisualizeById(id);

  const picklist = RenderAllPicklist('Visualize');
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      name: data?.name || '',
      group: data?.group || '',
      image: data?.image || null,
      dimension_weight: data?.dimension_weight || 0,
      dimension_height: data?.dimension_height || 0,
      area_x1: data?.area_x1 || 0,
      area_y1: data?.area_y1 || 0,
      area_x2: data?.area_x2 || 0,
      area_y2: data?.area_y2 || 0,
      tags: data?.tags || [],
    }),
    [data]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, setValue, handleSubmit } = methods;

  useEffect(() => {
    if (id && data) {
      reset({
        name: data?.name || '',
        group: data?.group || '',
        image: data?.image ? `${imgUrl}/users/${data?.image}` : null,
        dimension_weight: data?.dimension_weight || 0,
        dimension_height: data?.dimension_height || 0,
        area_x1: data?.area_x1 || 0,
        area_y1: data?.area_y1 || 0,
        area_x2: data?.area_x2 || 0,
        area_y2: data?.area_y2 || 0,
        tags: data?.tags || [],
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useAddVisualize(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.image) {
        toast.error('Image is required');
        return;
      }
      const formData = new FormData();

      if (typeof data.image === 'string' && !data.image.includes('https')) {
        formData.append('planImg', data.image);
      } else if (data.image instanceof File) {
        formData.append('planImg', data.image);
      }

      delete data.image;

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      await mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveImg = () => {
    setValue('image', null);
  };

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text required name="name" label="Visualize Name" />
        <Field.SingelSelect
          required
          name="group"
          label="Select Group"
          options={picklist ? picklist : []}
        />
        <Field.Text required name="dimension_weight" label="Dimension Weight" />
        <Field.Text required name="dimension_height" label="Dimension Height" />
        <Field.Text required name="area_x1" label="Area X1" />
        <Field.Text required name="area_y1" label="Area Y1" />
        <Field.Text required name="area_x2" label="Area X2" />
        <Field.Text required name="area_y2" label="Area Y2" />

        <Field.Autocomplete
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
        />
      </Stack>
    </Card>
  );

  const renderImage = (
    <>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Add Image *" sx={{ mb: 2 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Upload name="image" onDelete={handleRemoveImg} />
        </Stack>
      </Card>
    </>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <CustomBreadcrumbs
        heading="Add Visualize"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add Visualize' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          {renderDetails}
          {renderImage}
          <div className="flex flex-row justify-end gap-3 mt-8">
            <span
              onClick={() => navigate(paths.dashboard.visualize.list)}
              className="bg-white text-black border py-2 px-3 rounded-md"
            >
              Cancel
            </span>
            <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
