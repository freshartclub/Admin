import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Alert, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import useAddEmailType from './http/useAddEmailType';
import { useGetEmailById } from './http/useGetEamilById';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  emailType: zod.string().min(1, { message: 'Email Type is required!' }),
  emailHead: zod.string().min(1, { message: 'Email Heading is required!' }),
  emailDesc: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  //   images: zod.any().optional(),
});

// ----------------------------------------------------------------------

export function AddEmailType() {
  const id = useSearchParams().get('id');

  const navigate = useNavigate();
  const { data, isLoading } = useGetEmailById(id);

  const defaultValues = useMemo(
    () => ({
      emailType: '',
      emailHead: '',
      emailDesc: '',
    }),
    [data]
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (id && data) {
      reset({
        emailType: data?.emailType || '',
        emailHead: data?.emailHead || '',
        emailDesc: data?.emailDesc || '',
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useAddEmailType(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutate(data);
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
          <Field.Text disabled={id ? true : false} required name="emailType" label="Email Type" />
          <Field.Text required name="emailHead" label="Email Heading/Title" />
          <Alert severity="info">
            The value which will come dynamically from server should be enclosed within '%' Eg:
            Hello %name%, It will be replaced by actual value from server when the email is sent.
            This is neccessary in order to make the email dynamic and send to correct user.
          </Alert>
          <Alert severity="warning">
            Currently supported variables are:
            <ol>
              <li>- %name%</li>
              <li>- %email%</li>
              <li>- %phone%</li>
              <li>- %link% (To send a reset password link)</li>
              <li>- %otp%</li>
              <li>- %password% (To send a password changed by admin)</li>
              <li>- %gender%</li>
            </ol>
          </Alert>
          <Field.Editor
            required
            name="emailDesc"
            label="Email Description"
            sx={{ maxHeight: 480 }}
          />
        </Box>
      </Stack>
    </Card>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading={`${id ? 'Edit' : 'Add'} Email Type`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: `${id ? 'Edit' : 'Add'} Email Type` },
        ]}
        sx={{ mb: 3 }}
      />
      <Form methods={methods}>
        {renderDetails}
        <Stack spacing={{ xs: 3, md: 3 }}>
          <div className="flex justify-end gap-2">
            <span
              onClick={() => navigate(paths.dashboard.category.email.list)}
              className="px-3 py-2 text-white bg-red-500 rounded-md cursor-pointer"
            >
              Cancel
            </span>
            <span
              onClick={onSubmit}
              className="px-3 py-2 text-white bg-black rounded-md cursor-pointer"
            >
              {isPending ? 'Saving...' : 'Save'}
            </span>
          </div>
        </Stack>
      </Form>
    </>
  );
}
