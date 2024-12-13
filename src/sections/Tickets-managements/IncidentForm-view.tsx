import type { IPostItem } from 'src/types/blog';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { INC_SEVERITY_OPTIONS, INC_STATUS_OPTIONS } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';
import { RenderAllPicklists } from '../Picklists/RenderAllPicklist';
import useAddIncidentMutation from './http/useAddIncidentMutation';
import { useSearchParams } from 'src/routes/hooks';
import { useGetIncidentById } from './http/useGetIncidentById';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  incGroup: zod.string().min(1, { message: 'Group is required!' }),
  incType: zod.string().min(1, { message: 'Type is required!' }),
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  initTime: schemaHelper.date({ message: { required_error: 'Initial Date is required!' } }),
  endTime: schemaHelper.date({ message: { required_error: 'End Date is required!' } }),
  severity: zod.string().min(1, { message: 'Severity is required!' }),
  status: zod.string().min(1, { message: 'Status is required!' }),
  note: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddIncidentForm({ currentPost }: Props) {
  const id = useSearchParams().get('id');
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useAddIncidentMutation(id);
  const { data, isLoading } = useGetIncidentById(id);

  const picklists = RenderAllPicklists(['Inc Group', 'Inc Type']);

  const picklistMap = picklists.reduce((acc, item: any) => {
    acc[item?.fieldName] = item?.picklist;
    return acc;
  }, {});

  const grp = picklistMap['Inc Group'];
  const type = picklistMap['Inc Type'];

  const defaultValues = useMemo(
    () => ({
      incGroup: currentPost?.incGroup || '',
      incType: currentPost?.incType || '',
      title: currentPost?.title || '',
      description: currentPost?.description || '',
      initTime: currentPost?.initTime || '',
      endTime: currentPost?.endTime || '',
      severity: currentPost?.severity || '',
      status: currentPost?.status || '',
      note: currentPost?.note || '',
    }),
    [currentPost]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;
  const values = watch();

  useEffect(() => {
    if (data) {
      reset({
        incGroup: data.incGroup,
        incType: data.incType,
        title: data.title,
        description: data.description,
        initTime: data.initTime,
        endTime: data.endTime,
        severity: data.severity,
        status: data.status,
        note: data.note,
      });
    }
  }, [data]);

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
      <Stack spacing={3} sx={{ p: 2 }}>
        <Field.SingelSelect
          required
          checkbox
          name="incGroup"
          label="Inc. Group"
          options={grp ? grp : []}
        />
        <Field.SingelSelect
          required
          checkbox
          name="incType"
          label="Inc. Type"
          options={type ? type : []}
        />

        <Field.Text required name="title" label="Title" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Description</Typography>
          <Field.Editor required name="description" sx={{ maxHeight: 480 }} />
        </Stack>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.MobileDateTimePicker
            required
            name="initTime"
            label="Incident Initial Date"
            onChange={(e) => {
              methods.setValue('endTime', e.$d);
              methods.setValue('initTime', e.$d);
            }}
          />
          <Field.MobileDateTimePicker required name="endTime" label="Incident End Date" />
        </Box>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.SingelSelect
            checkbox
            required
            name="severity"
            label="Severity"
            options={INC_SEVERITY_OPTIONS}
          />
          <Field.SingelSelect
            required
            checkbox
            name="status"
            label="Status"
            options={INC_STATUS_OPTIONS}
          />
        </Box>

        <Field.Text name="note" label="Internal Note" multiline rows={4} />
      </Stack>
    </Card>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <CustomBreadcrumbs
        heading={`${id ? 'Edit' : 'Add'} Incident`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: id ? 'Edit Incident' : 'Add Incident' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          {renderDetails}

          <div className="flex flex-row justify-end gap-3 mt-8">
            <span
              onClick={() => navigate(paths.dashboard.tickets.allIncident)}
              className="bg-white cursor-pointer text-black border py-2 px-3 rounded-md"
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
