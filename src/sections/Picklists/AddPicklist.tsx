import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Autocomplete, Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
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
  isDeleted: zod.boolean(),
});

// ----------------------------------------------------------------------

export function AddPicklist() {
  const id = useSearchParams().get('id');
  const name = useSearchParams().get('name');

  const navigate = useNavigate();
  const { data, isLoading } = useGetPicklistMutation();
  const { data: picklistData } = useGetPicklistById(id, name);

  const [value, setValue] = useState('');

  const defaultValues = useMemo(
    () => ({
      picklistName: picklistData?.picklistName || '',
      name: picklistData?.name || '',
      isDeleted: picklistData?.isDeleted || false,
    }),
    [picklistData]
  );

  const handleSave = () => {
    methods.setValue('picklistName', value);
  };

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
        isDeleted: picklistData?.isDeleted || false,
      });
    }
  }, [picklistData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (id) {
        updateMutate(data);
      } else {
        mutate(data);
      }
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
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Autocomplete
              disabled={id ? true : false}
              freeSolo
              fullWidth
              options={data.map((item) => item.picklistName) || []}
              value={value}
              onChange={(event, newValue) => setValue(newValue || '')}
              onInputChange={(event, newInputValue) => setValue(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select or Type New Picklist Name"
                  placeholder="Select or Type New Picklist Name"
                  required
                />
              )}
              openOnFocus
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!value.trim()}
            >
              Select
            </Button>
          </div>
          <Field.Text disabled required name="picklistName" label="Picklist Name" />
          <Field.Text
            required
            helperText="Name of the field which will go inside the Picklist"
            name="name"
            label="Field Name"
          />

          <Field.SingelSelect
            helperText="Select if this field should be active or not"
            required
            sx={{ width: 1 }}
            options={optionsIn}
            name="isDeleted"
            label="Status"
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
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      <Form methods={methods} onSubmit={onSubmit}>
        {renderDetails}
        <Stack spacing={{ xs: 3, md: 5 }}>
          <div className="flex justify-end gap-2">
            <span
              onClick={() => navigate(paths.dashboard.category.picklist.list)}
              className="px-3 py-2 text-white bg-black rounded-md cursor-pointer"
            >
              Cancel
            </span>
            <button type="submit" className="px-3 py-2 text-white bg-black rounded-md">
              {isPending || updatePending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Stack>
      </Form>
    </>
  );
}
