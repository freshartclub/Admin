import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import useAddPicklist from './http/useAddPicklist';
import { useGetPicklistById } from './http/useGetPicklistById';
import { useGetPicklistMutation } from './http/useGetPicklistMutation';
import useUpdatePicklist from './http/useUpdatePicklist';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  picklistName: zod.string().min(1, { message: 'Picklist Name is required!' }),
  name: zod.string().min(1, { message: 'Name is required!' }),
});

// ----------------------------------------------------------------------

export function AddPicklist() {
  const id = useSearchParams().get('id');
  const name = useSearchParams().get('name');

  const navigate = useNavigate();
  const { data, isLoading } = useGetPicklistMutation();
  const { data: picklistData } = useGetPicklistById(id, name);

  const defaultValues = useMemo(
    () => ({
      picklistName: picklistData?.picklistName || '',
      name: picklistData?.name || '',
    }),
    [picklistData]
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;
  const { mutate, isPending } = useAddPicklist();
  const { mutate: updateMutate, isPending: updatePending } = useUpdatePicklist(id, name);

  useEffect(() => {
    if (id && picklistData) {
      reset({
        name: picklistData?.name || '',
        picklistName: picklistData?.picklistName || '',
      });
    }
  }, [picklistData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (id && name) {
        updateMutate(data);
      } else {
        const pickName = methods.getValues('picklistName');
        if (!pickName) return toast.error('Picklist Name is required!');
        data.isAddMore = false;
        mutate(data);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const onAddMoreSubmit = handleSubmit(async (data) => {
    try {
      const pickName = methods.getValues('picklistName');
      if (!pickName) return toast.error('Picklist Name is required!');
      data.isAddMore = true;
      mutate(data);
      methods.setValue('name', '');
    } catch (error) {
      console.error(error);
    }
  });

  if (isLoading) return <LoadingScreen />;

  const renderDetails = (
    <Card sx={{ mb: 5 }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={4}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
        >
          <Field.Autocomplete
            disabled={id ? true : false}
            freeSolo
            fullWidth
            label="Type or Select Picklist Name & Press Enter"
            helperText="When creating a new Picklist, please press 'ENTER' button unless it will give error"
            name="picklistName"
            options={data.map((item) => item.picklistName) || []}
            disableCloseOnSelect={false}
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
            openOnFocus
          />

          <Field.Text
            required
            helperText="Name of the field which will go inside the Picklist"
            name="name"
            label="Item List Name"
          />
        </Box>
      </Stack>
    </Card>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading={`${id ? 'Edit' : 'Add'} Picklist`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: `${id ? 'Edit' : 'Add'} Picklist` },
        ]}
        sx={{ mb: 3 }}
      />
      <Form methods={methods}>
        {renderDetails}
        <Stack spacing={{ xs: 3, md: 3 }}>
          <div className="flex justify-end gap-2">
            <span
              onClick={() => navigate(paths.dashboard.category.picklist.list)}
              className="px-3 py-2 text-white bg-red-500 rounded-md cursor-pointer"
            >
              Cancel
            </span>
            {!id && !name ? (
              <span
                onClick={onAddMoreSubmit}
                className="px-3 py-2 text-white bg-green-700 rounded-md cursor-pointer"
              >
                {isPending || updatePending ? 'Saving...' : 'Save & Add more'}
              </span>
            ) : null}
            <span
              onClick={onSubmit}
              className="px-3 py-2 text-white bg-black rounded-md cursor-pointer"
            >
              {isPending || updatePending ? 'Saving...' : 'Save'}
            </span>
          </div>
        </Stack>
      </Form>
    </>
  );
}
