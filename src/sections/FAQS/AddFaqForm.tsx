import { zodResolver } from '@hookform/resolvers/zod';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { _tags } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';
import useAddFAQMutation from './http/useAddFAQMutation';
import { useGetFAQById } from './http/useGetFAQById';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  faqGrp: zod.string().min(1, { message: 'FAQ Grp is required!' }),
  faqQues: zod.string().min(1, { message: 'FAQ Question is required!' }),
  faqAns: zod.string().min(1, { message: 'faq Description is required!' }),
  tags: zod.string().array().optional(),
});

// ----------------------------------------------------------------------

export function AddFaqForm() {
  const id = useSearchParams().get('id');
  const { data, isLoading } = useGetFAQById(id);
  const picklist = RenderAllPicklist('FAQ Group');
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      faqGrp: data?.faqGrp || '',
      faqQues: data?.faqQues || '',
      faqAns: data?.faqAns || '',
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
        faqGrp: data?.faqGrp || '',
        faqQues: data?.faqQues || '',
        faqAns: data?.faqAns || '',
        tags: data?.tags || [],
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useAddFAQMutation(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutate(data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          required
          name="faqGrp"
          label="Select Group"
          options={picklist ? picklist : []}
        />
        <Field.Text required name="faqQues" label="Faq Question" />
        <Field.Text name="faqAns" label="FAQ Answer (write min 250 word)" multiline rows={4} />

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
        heading="Add FAQ"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add FAQ' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
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
        </Stack>
      </Form>
    </div>
  );
}
