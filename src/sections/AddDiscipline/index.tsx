import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import useAddDisciplineMutation from './http/useAddDisciplineMutation';
import { ArtistDisciplineType } from 'src/types/artist/ArtistDetailType';
import { useSearchParams } from 'src/routes/hooks';
import { useGetDisciplineById } from './http/useGetDisciplineById';
import { LoadingScreen } from 'src/components/loading-screen';
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  disciplineImage: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
  name: zod.string().min(1, { message: 'Title is required!' }),
  spanishName: zod.string().min(1, { message: 'Spanish Title is required!' }),
  description: zod.string().min(1, { message: 'Discription is required!' }),
  isDeleted: zod.boolean(),
});

// ----------------------------------------------------------------------

export function AddDisciline() {
  const id = useSearchParams().get('id');
  const navigate = useNavigate();
  const { mutate, isPending } = useAddDisciplineMutation(id);

  const { data, isLoading } = useGetDisciplineById(id);
  let url = '';

  const defaultValues = useMemo(
    () => ({
      disciplineImage: url
        ? `${url}/${data?.data?.disciplineImage}`
        : data?.data?.disciplineImage || null,
      name: data?.data?.disciplineName || '',
      isDeleted: data?.data?.isDeleted || false,
      spanishName: data?.data?.disciplineSpanishName || '',
      description: data?.data?.disciplineDescription || '',
    }),
    [data?.data]
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, setValue, handleSubmit } = methods;

  useEffect(() => {
    if (id && data?.data) {
      url = `${data?.url}/uploads/users`;
      reset({
        name: data?.data?.disciplineName || '',
        isDeleted: data?.data?.isDeleted || false,
        spanishName: data?.data?.disciplineSpanishName || '',
        description: data?.data?.disciplineDescription || '',
      });
    }
  }, [data?.data, reset]);

  useEffect(() => {
    if (id && data?.url) {
      url = `${data?.url}/uploads/users`;
      reset({
        disciplineImage: url
          ? `${url}/${data?.data?.disciplineImage}`
          : data?.data?.disciplineImage || null,
      });
    }
  }, [data?.url, reset]);

  const handleRemoveFile = useCallback(() => {
    setValue('disciplineImage', null);
  }, [setValue]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      if (!data.disciplineImage) {
        toast.error('Image is required');
        return;
      }
      const formData = new FormData();

      formData.append('disciplineImage', data.disciplineImage);
      formData.append('name', data.name);
      formData.append('spanishName', data.spanishName);
      formData.append('description', data.description);
      formData.append('isDeleted', data.isDeleted);

      mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

  const optionsIn = [
    {
      label: 'Active',
      value: false,
    },
    {
      label: 'Inactive',
      value: true,
    },
  ];

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={4}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Upload
            required
            name="disciplineImage"
            maxSize={3145728}
            onDelete={handleRemoveFile}
          />
          <div className="form flex gap-2 flex-col w-full">
            <Field.Text required name="name" label="Title" />
            <Field.Text required name="spanishName" label="Spanish Title" />
            <Field.Text required name="description" label="Description" multiline rows={3} />
            <Field.SingelSelect
              helperText="Select if this discipline should be active or not"
              required
              sx={{ width: 1 }}
              options={optionsIn}
              name="isDeleted"
              label="Status"
            />
          </div>
        </Box>
      </Stack>
    </Card>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <CustomBreadcrumbs
        heading={id ? 'Edit Discipline' : 'Add Discipline'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: id ? 'Edit Discipline' : 'Add Discipline' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 3 }}>
          {renderDetails}

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
}
