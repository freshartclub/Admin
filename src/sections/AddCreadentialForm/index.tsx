import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fData } from 'src/utils/format-number';
import { z as zod } from 'zod';
import useAddInsigniaMutation from './http/useAddInsigniaMutation';
import { useGetInsigniaById } from './http/useGetInsigniaById';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';
import { imgUrl } from 'src/utils/BaseUrls';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  insigniaImage: schemaHelper.file({ required: false }).optional(),
  credentialName: zod.string().min(1, { message: 'Name is required!' }),
  credentialGroup: zod.string().min(1, { message: 'Group is required!' }),
  credentialPriority: zod.string().min(1, { message: 'Display Priority is required!' }),
  isMain: zod.boolean(),
  isActive: zod.boolean(),
});

// ----------------------------------------------------------------------

export function AddCreadentialForm() {
  const id = useSearchParams().get('id');
  const { mutate, isPending } = useAddInsigniaMutation(id);
  const navigate = useNavigate();

  const { data, isLoading } = useGetInsigniaById(id);
  const picklist = RenderAllPicklist('Insignia Group');

  const defaultValues = useMemo(
    () => ({
      insigniaImage: data?.insigniaImage || null,
      isActive: data?.isActive || true,
      isMain: data?.isMain || false,
      credentialName: data?.credentialName || '',
      credentialGroup: data?.credentialGroup || '',
      credentialPriority: data?.credentialPriority || '',
    }),
    [data]
  );

  const methods = useForm<NewUserSchemaType>({
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (id && data) {
      reset({
        insigniaImage: `${imgUrl}/users/${data?.insigniaImage}` || null,
        isActive: data?.isActive,
        isMain: data?.isMain,
        credentialName: data?.credentialName || '',
        credentialGroup: data?.credentialGroup || '',
        credentialPriority: data?.credentialPriority || '',
      });
    }
  }, [data]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      if (!data.insigniaImage) {
        toast.error('Image is required');
        return;
      }

      const formData = new FormData();

      if (typeof data.insigniaImage === 'string' && !data.insigniaImage.includes('https')) {
        formData.append('insigniaImage', data.insigniaImage);
      } else if (data.insigniaImage instanceof File) {
        formData.append('insigniaImage', data.insigniaImage);
      }

      formData.append('credentialGroup', data.credentialGroup);
      formData.append('credentialName', data.credentialName);
      formData.append('credentialPriority', data.credentialPriority);
      formData.append('isActive', data.isActive);
      formData.append('isMain', data.isMain);

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

  const handleRemoveFile = () => {
    methods.setValue('insigniaImage', null);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Box>
              <Field.Upload
                name="insigniaImage"
                maxSize={3145728}
                onDelete={handleRemoveFile}
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
                    Allowed *.jpeg, *.jpg, *.png
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
              <Field.SingelSelect
                required
                name="credentialGroup"
                label="Insignia Group"
                options={picklist ? picklist : []}
              />
              <Field.Text required name="credentialPriority" label="Display Priority" />
              <Field.SingelSelect
                required
                sx={{ width: 1 }}
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
                name="isMain"
                label="Main Insignia"
              />
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
