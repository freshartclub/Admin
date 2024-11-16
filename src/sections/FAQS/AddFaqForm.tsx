import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { toast } from 'src/components/snackbar';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { _tags } from 'src/_mock';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { useNavigate } from 'react-router';
import { FAQ_GROUP_OPTIONS } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import useAddFAQMutation from './http/useAddFAQMutation';
import { useGetFAQById } from './http/useGetFAQById';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  faqGrp: zod.string().min(1, { message: 'FAQ Grp is required!' }),
  faqQues: zod.string().min(1, { message: 'FAQ Question is required!' }),
  faqAns: zod.string().min(1, { message: 'faq Description is required!' }),
  faqImg: schemaHelper.file({ required: false }).optional(),
  tags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  existingImages: zod.string().array().optional(),
});

// ----------------------------------------------------------------------

export function AddFaqForm() {
  const id = useSearchParams().get('id');
  const { data, isLoading } = useGetFAQById(id);
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      faqGrp: data?.data?.faqGrp || '',
      faqQues: data?.data?.faqQues || '',
      faqAns: data?.data?.faqAns || '',
      faqImg: data?.data?.faqImg || [],
      tags: data?.data?.tags || [],
      existingImages: []
    }),
    [data?.data]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;
  const values = watch();

  let arr: any = [];

  useEffect(() => {
    if (id && data?.data) {
      data?.data?.faqImg && data?.data?.faqImg.length > 0 && data?.data?.faqImg.forEach((item, i) => (
        arr.push(`${data?.url}/users/${item}`)
      ))
      reset({
        faqGrp: data?.data?.faqGrp || '',
        faqQues: data?.data?.faqQues || '',
        faqAns: data?.data?.faqAns || '',
        faqImg: arr || [],
        tags: data?.data?.tags || [],
        existingImages: data?.data?.faqImg || [],
      });
    }
  }, [data?.data, reset]);

  const { mutate, isPending } = useAddFAQMutation(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.faqImg) {
        return toast.error("Please upload at least one image");
      }

      const formData = new FormData();

      data?.faqImg && data?.faqImg?.forEach((item: any) => {
        if (typeof item === 'object') {
          formData.append('faqImg', item);
        }
      })

      delete data?.faqImg;

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      await mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFileDetails = useCallback(
    (inputFile: any) => {
      const filtered = values.faqImg.filter((file) => file !== inputFile);
      setValue('faqImg', filtered);
      setValue("existingImages", filtered);
    },
    [setValue, values.faqImg]
  );

  const handleRemoveAllFiles = useCallback(async () => {
    await setValue('faqImg', []);
    await setValue('existingImages', []);
  }, [setValue]);

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          required
          name="faqGrp"
          label="Select Group"
          options={FAQ_GROUP_OPTIONS}
        />
        <Field.Text required name="faqQues" label="Faq Question" />
        <Field.Text
          name="faqAns"
          label="FAQ Answer (write min 250 word)"
          multiline
          rows={4}
        />

        <Field.Autocomplete
          required
          name="tags"
          label="Tags *"
          helperText="Must have at least 2 items"
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

  const renderProperties = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">FAQ Images *</Typography>
          <Field.Upload
            required
            multiple
            thumbnail
            helperText="Only 3 files are allowed"
            name="faqImg"
            maxSize={3145728}
            onRemove={handleRemoveFileDetails}
            onRemoveAll={handleRemoveAllFiles}
          />
        </Stack>
      </Stack>
    </Card>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <CustomBreadcrumbs
        heading="Add FAQ"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add FAQ' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">{renderProperties}</div>
            <div className="col-span-2">
              {renderDetails}
              <div className="flex flex-row justify-end gap-3 mt-8">
                <span
                  onClick={() => navigate(paths.dashboard.faq.list)}
                  className="bg-white text-black border py-2 px-3 rounded-md"
                >
                  Cancel
                </span>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  {isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </Stack>
      </Form>
    </div>
  );
}