import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
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

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  disciplineImage: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
  name: zod.string().min(1, { message: 'Title is required!' }),
  spanishName: zod.string().min(1, { message: 'Spanish Title is required!' }),
  description: zod.string().min(1, { message: 'Discription is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  disciplineFormData?: AddArtistComponentProps;
};

export function AddDisciline({ disciplineFormData }: Props) {
  const { mutate, isPending } = useAddDisciplineMutation();

  const defaultValues = useMemo(
    () => ({
      disciplineImage: disciplineFormData?.disciplineImage || null,
      name: disciplineFormData?.name || '',
      spanishName: disciplineFormData?.spanishName || '',
      description: disciplineFormData?.description || '',
    }),
    [disciplineFormData]
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleRemoveFile = useCallback(() => {
    setValue('disciplineImage', null);
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
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

      mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

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
            <Field.Text required name="description" label="Description" multiline rows={6} />
          </div>
        </Box>
      </Stack>
    </Card>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading="Add Discipline"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add Discipline' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 3 }}>
          {renderDetails}

          <div className="flex justify-end">
            <button
              disabled={isPending}
              type="submit"
              className="px-3 py-2 text-white bg-black rounded-md"
            >
              {isPending ? 'Adding...' : 'Add Discipline'}
            </button>
          </div>
        </Stack>
      </Form>
    </>
  );
}
