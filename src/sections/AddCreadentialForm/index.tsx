import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { fData } from 'src/utils/format-number';
import { z as zod } from 'zod';
import useAddInsigniaMutation from './http/useAddInsigniaMutation';
import { useGetInsigniaById } from './http/useGetInsigniaById';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  insigniaImage: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
  credentialName: zod.string().min(1, { message: 'Name is required!' }),
  credentialGroup: zod.string().min(1, { message: 'Group is required!' }),
  credentialPriority: zod.string().min(1, { message: 'Display Priority is required!' }),
  isActive: zod.boolean(),
});

// ----------------------------------------------------------------------

export function AddCreadentialForm() {
  const id = useSearchParams().get('id');
  const { mutate, isPending } = useAddInsigniaMutation(id);
  const navigate = useNavigate();

  const { data, isLoading } = useGetInsigniaById(id);

  const defaultValues = useMemo(
    () => ({
      insigniaImage: `${data?.url}/users/${data?.data?.insigniaImage}` || null,
      isActive: data?.data?.isActive || true,
      credentialName: data?.data?.credentialName || '',
      credentialGroup: data?.data?.credentialGroup || '',
      credentialPriority: data?.data?.credentialPriority || '',
    }),
    [data?.data]
  );

  const methods = useForm<NewUserSchemaType>({
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (id && data?.data) {
      reset({
        insigniaImage: `${data?.url}/users/${data?.data?.insigniaImage}` || null,
        isActive: data?.data?.isActive,
        credentialName: data?.data?.credentialName || '',
        credentialGroup: data?.data?.credentialGroup || '',
        credentialPriority: data?.data?.credentialPriority || '',
      });
    }
  }, [data?.data, reset]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      const formData = new FormData();

      formData.append('credentialGroup', data.credentialGroup);
      formData.append('credentialName', data.credentialName);
      formData.append('credentialPriority', data.credentialPriority);
      formData.append('insigniaImage', data.insigniaImage);
      formData.append('isActive', data.isActive);

      mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });


  const optionsIn = [
    {
      label: 'Active',
      value: true,
    },
    {
      label: 'Inactive',
      value: false,
    },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="insigniaImage"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
            >
              <Field.Text required name="credentialName" label="Insignia Name" />
              <Field.Text required name="credentialGroup" label="Insignia Group" />
              <Field.Text required name="credentialPriority" label="Display Priority" />
              <Field.SingelSelect
                helperText="Select if this credential should be active or not"
                required
                sx={{ width: 1 }}
                options={optionsIn}
                name="isActive"
                label="Active"
              />
            </Box>
            <div className="flex justify-end gap-2">
              <span
                onClick={() => navigate(paths.dashboard.creadentialsAndInsigniasArea.list)}
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
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
