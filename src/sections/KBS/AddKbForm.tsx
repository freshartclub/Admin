import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { _tags } from 'src/_mock';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';
import useAddKBMutation from './http/useAddKBMutation';
import { useGetKBById } from './http/useGetKBById';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  kbGrp: zod.string().min(1, { message: 'KB Group is required!' }),
  kbTitle: zod.string().min(1, { message: 'KB Title is required!' }),
  kbDesc: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  tags: zod.string().array().optional(),
});

// ----------------------------------------------------------------------

export function AddKbForm() {
  const id = useSearchParams().get('id');
  const { data, isLoading } = useGetKBById(id);
  const picklist = RenderAllPicklist('KB Group');
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      kbGrp: data?.kbGrp || '',
      kbTitle: data?.kbTitle || '',
      kbDekbDescscription: data?.kbDesc || '',
      tags: data?.tags || [],
    }),
    [data]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (id && data) {
      reset({
        kbGrp: data?.kbGrp || '',
        kbTitle: data?.kbTitle || '',
        kbDesc: data?.kbDesc || '',
        tags: data?.tags || [],
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useAddKBMutation(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutate(data);
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
          name="kbGrp"
          label="Select Group"
          options={picklist ? picklist : []}
        />

        <Field.Text name="kbTitle" label="KB Title" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">KB Description</Typography>
          <Field.Editor name="kbDesc" sx={{ maxHeight: 480 }} />
        </Stack>

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

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <CustomBreadcrumbs
        heading={`${id ? 'Edit' : 'Add'} KB`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: `${id ? 'Edit' : 'Add'} KB` },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          {renderDetails}
          <div className="flex flex-row justify-end gap-3 mt-8">
            <span
              onClick={() => navigate(paths.dashboard.kbdatabase.list)}
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
