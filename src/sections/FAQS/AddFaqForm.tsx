import type { IPostItem } from 'src/types/blog';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { _tags } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { FAQ_GROUP_OPTIONS } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  group: zod.string().min(1, { message: 'group is required!' }),
  faqQuestion: zod.string().min(1, { message: 'faq Question is required!' }),
  faqDescription: zod.string().min(1, { message: 'faq Description is required!' }),
  images: schemaHelper.file({ message: { required_error: 'Images is required!' } }),
  tags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddFaqForm({ currentPost }: Props) {
  const router = useRouter();

  const preview = useBoolean();

  const defaultValues = useMemo(
    () => ({
      group: currentPost?.group || '',
      faqQuestion: currentPost?.faqQuestion || '',
      faqDescription: currentPost?.faqDescription || '',
      images: currentPost?.images || [],
      tags: currentPost?.tags || [],
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      preview.onFalse();
      toast.success(currentPost ? 'Update success!' : 'Create success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFileDetails = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const renderDetails = (
    <Card>
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="group"
          label="select Group"
          options={FAQ_GROUP_OPTIONS}
        />

        <Field.Text name="faqQuestion" label="Faq Question" />

        <Field.Text
          name="faqDescription"
          label="FAQ Answer (write min 250 word)"
          multiline
          rows={4}
        />

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

  const renderProperties = (
    <Card>
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">images</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFileDetails}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <div>
      <CustomBreadcrumbs
        heading="FAQ"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          // { name: 'FAQ', href: paths.dashboard.faq.Root},
          { name: 'Add FAQ' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              {renderDetails}
              <div className="flex flex-row justify-end gap-3 mt-8">
                <button type="button" className="bg-white text-black border py-2 px-3 rounded-md">
                  Cencel
                </button>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  Save FAQ
                </button>
              </div>
            </div>

            <div className="col-span-1">{renderProperties}</div>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
