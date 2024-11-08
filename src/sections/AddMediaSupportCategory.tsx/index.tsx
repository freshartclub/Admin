import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { useGetDisciplineMutation } from '../DisciplineListCategory/http/useGetDisciplineMutation';
import addMediaMutation from './http/addMediaMutation';
import { ArtistDisciplineType } from 'src/types/artist/ArtistDetailType';
import { useSearchParams } from 'src/routes/hooks';
import { useGetMediaById } from './http/useGetMediaById';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Title is required!' }),
  spanishName: zod.string().min(1, { message: 'Spanish Title is required!' }),
  discipline: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
});

// ----------------------------------------------------------------------

type Props = {
  styleFormData?: ArtistDisciplineType;
};

export function AddMediaSupportCategory({ styleFormData }: Props) {
  const id = useSearchParams().get('id');
  const { data } = useGetDisciplineMutation();
  const { data: styleData, isLoading } = useGetMediaById(id);

  const defaultValues = useMemo(
    () => ({
      name: styleData?.mediaName || '',
      spanishName: styleData?.spanishMediaName || '',
      discipline: (styleData?.discipline && styleData?.discipline.map((item) => item._id)) || [],
    }),
    [styleData]
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

  useEffect(() => {
    if (id && styleData) {
      reset({
        name: styleData?.mediaName || '',
        spanishName: styleData?.spanishMediaName || '',
        discipline: styleData?.discipline.map((item) => item._id) || [],
      });
    }
  }, [styleData, reset]);

  const { mutate, isPending } = addMediaMutation(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutate(data);
    } catch (error) {
      console.error(error);
    }
  });

  const resetForm = () => {
    reset({
      name: '',
      spanishName: '',
      discipline: [],
    });
  };

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={4}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
        >
          <Field.Text required name="name" label="Title" />

          <Field.Text required name="spanishName" label="Spanish Title" />

          <Field.Autocomplete
            name="discipline"
            required
            label="Discipline"
            placeholder="+ Discipline"
            multiple
            freeSolo
            disableCloseOnSelect
            options={data && data.length > 0 ? data : []}
            getOptionLabel={(option) => option.disciplineName}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                {option.disciplineName}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option._id}
                  label={option.disciplineName}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
            onChange={(event, value) => {
              const selectedIds = value.map((item) => item._id);
              setValue('discipline', selectedIds);
            }}
            value={
              data && data.length > 0
                ? data.filter((item) => watch('discipline').includes(item._id))
                : []
            }
          />
        </Box>
      </Stack>
    </Card>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading={id ? 'Edit Media' : 'Add Media'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: id ? 'Edit Media' : 'Add Media' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          {renderDetails}

          <div className="flex justify-end gap-2">
            <span
              onClick={resetForm}
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
