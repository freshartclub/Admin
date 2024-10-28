import type { IPostItem } from 'src/types/blog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import {
  INC_GROUP_OPTIONS,
  INC_SEVERITY_OPTIONS,
  INC_STATUS_OPTIONS,
  INC_TYPE_OPTIONS,
} from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import useAddIncidentMutation from './http/useAddIncidentMutation';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  incGroup: zod.string().min(1, { message: 'group is required!' }),
  incType: zod.string().min(1, { message: 'Type is required!' }),
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  date: schemaHelper.date({ message: { required_error: 'date is required!' } }),
  initTime: zod.string().min(1, { message: 'Initial time is required!' }),
  endTime: zod.string().min(1, { message: 'End time is required!' }),
  severity: zod.string().min(1, { message: 'Severity is required!' }),
  status: zod.string().min(1, { message: 'Status is required!' }),
  note: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddIncidentForm({ currentPost }: Props) {
  const { mutateAsync, isPending } = useAddIncidentMutation();

  const defaultValues = useMemo(
    () => ({
      incGroup: currentPost?.incGroup || '',
      incType: currentPost?.incType || '',
      title: currentPost?.title || '',
      description: currentPost?.description || '',
      date: currentPost?.date || '',
      initTime: currentPost?.initTime || '',
      endTime: currentPost?.endTime || '',
      severity: currentPost?.severity || '',
      status: currentPost?.status || '',
      note: currentPost?.note || '',
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
      mutateAsync(data).then((res) => {
        reset();
      });
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
          name="incGroup"
          label="Inc. Group"
          options={INC_GROUP_OPTIONS}
        />
        <Field.SingelSelect checkbox name="incType" label="Inc. Type" options={INC_TYPE_OPTIONS} />

        <Field.Text name="title" label="Title" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Description</Typography>
          <Field.Editor name="description" sx={{ maxHeight: 480 }} />
        </Stack>

        <Field.MobileDateTimePicker name="date" label="Incident Date & Time" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.TimePicker name="initTime" label="Init Time" />

          <Field.TimePicker name="endTime" label="End Time" />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.SingelSelect
            checkbox
            name="severity"
            label="Severity"
            options={INC_SEVERITY_OPTIONS}
          />
          <Field.SingelSelect checkbox name="status" label="Status" options={INC_STATUS_OPTIONS} />
        </Box>

        <Field.Text name="note" label="Note" multiline rows={4} />
      </Stack>
    </Card>
  );

  return (
    <div>
      <CustomBreadcrumbs
        heading="New Incident"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add Incident' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              {renderDetails}
              <div className="flex flex-row justify-start gap-3 mt-8">
                <button type="button" className="bg-white text-black border py-2 px-3 rounded-md">
                  Cancel
                </button>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  {isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="col-span-1"></div>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
