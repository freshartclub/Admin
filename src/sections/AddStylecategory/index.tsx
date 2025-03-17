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
import { ArtistDisciplineType } from 'src/types/artist/ArtistDetailType';
import { useGetDisciplineMutation } from '../DisciplineListCategory/http/useGetDisciplineMutation';
import addStyleMutation from './http/addStyleMutation';
import { useSearchParams } from 'src/routes/hooks';
import { useGetStyleById } from './http/useGetStyleById';
import { LoadingScreen } from 'src/components/loading-screen';
import { useNavigate } from 'react-router';

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Title is required!' }),
  discipline: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  isMain: zod.boolean(),
  isDeleted: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  styleFormData?: ArtistDisciplineType;
};

export function AddStyleCategory({ styleFormData }: Props) {
  const id = useSearchParams().get('id');
  const { data } = useGetDisciplineMutation();
  const navigate = useNavigate();
  const { data: styleData, isLoading } = useGetStyleById(id);

  const defaultValues = useMemo(
    () => ({
      name: styleData?.styleName || '',
      isMain: styleData?.isMain || false,
      isDeleted: styleData?.isDeleted || false,
      discipline: (styleData?.discipline && styleData?.discipline.map((item) => item._id)) || [],
    }),
    [styleData]
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;

  useEffect(() => {
    if (id && styleData) {
      reset({
        name: styleData?.styleName || '',
        isMain: styleData?.isMain || false,
        isDeleted: styleData?.isDeleted || false,
        discipline: styleData?.discipline.map((item) => item._id) || [],
      });
    }
  }, [styleData, reset]);

  const { mutate, isPending } = addStyleMutation(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutate(data);
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
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
        >
          <Field.Text required name="name" label="Title" />
          <Field.Autocomplete
            name="discipline"
            required
            label="Discipline"
            placeholder="+ Discipline"
            multiple
            freeSolo
            disableCloseOnSelect
            options={data && data.length > 0 ? data.filter((item: any) => !item.isDeleted) : []}
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

          <Field.SingelSelect
            helperText="Select if this style should be active or not"
            required
            sx={{ width: 1 }}
            options={optionsIn}
            name="isDeleted"
            label="Status"
          />
          <Field.SingelSelect
            required
            sx={{ width: 1 }}
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ]}
            name="isMain"
            label="Main Style"
          />
        </Box>
      </Stack>
    </Card>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <CustomBreadcrumbs
        heading={id ? 'Edit Artwork Style' : 'Add Artwork Style'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: id ? 'Edit Artwork Style' : 'Add Artwork Style' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          {renderDetails}

          <div className="flex justify- gap-2">
            <span
              onClick={() => navigate(paths.dashboard.category.style.list)}
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
