import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Card, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { imgUrl } from 'src/utils/BaseUrls';
import { z as zod } from 'zod';
import useAddCarousel from './http/useAddCarousel';
import { useGetCarouselById } from './http/useGetCarouselById';

type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  title: zod.string().optional(),
  subtitle: zod.string().optional(),
  content: schemaHelper.editor({ message: { required_error: 'Content is required!' } }),
  carouselImg: schemaHelper.file({ message: { required_error: 'Carousel Image is required!' } }),
  type: zod.string().min(1, { message: 'Carousel Type is required!' }),
  link: zod.object({
    text: zod.string().optional(),
    url: zod.string().optional(),
  }),
});

const AddCarousel = () => {
  const navigate = useNavigate();
  const id = useSearchParams().get('id');

  const { data, isLoading } = useGetCarouselById(id);

  const defaultValues = useMemo(
    () => ({
      title: data?.title || '',
      subtitle: data?.subtitle || '',
      content: data?.content || '',
      carouselImg: data?.carouselImg || '',
      type: data?.type || '',
      link: data?.link || {},
    }),
    [data]
  );
  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (data) {
      const updatedData = {
        ...data,
        carouselImg: `${imgUrl}/users/${data?.carouselImg}`,
      };
      reset(updatedData);
    }
  }, [data]);

  const { mutate, isPending } = useAddCarousel(id);

  const handleRemoveFile = () => {
    methods.setValue('carouselImg', null);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      if (!data.carouselImg) {
        toast.error('Carousel Image is required');
        return;
      }

      const formData = new FormData();

      if (data.type === 'Home-Banner' || data.type === 'Main-Banner') {
        if (!data.title || !data.subtitle) {
          return toast.error('Title and Subtitle is required');
        }
        formData.append('title', data.title);
        formData.append('subtitle', data.subtitle);
      }

      formData.append('type', data.type);
      formData.append('content', data.content);
      formData.append('carouselImg', data.carouselImg);
      formData.append('link', JSON.stringify(data.link));

      mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

  const CarouselType = [
    { value: 'Home-Banner', label: 'Home Banner Section' },
    { value: 'Main-Banner', label: 'Main Banner Section' },
    { value: 'Main-First', label: 'Main First Section' },
    { value: 'Main-Second', label: 'Main Second Section' },
    { value: 'Main-Third', label: 'Main Third Section' },
    { value: 'Main-Fourth', label: 'Main Fourth Section' },
  ];

  const renderDetails = (
    <Card>
      <CardHeader title="Carousel Details" sx={{ mb: 2 }} />
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect required name="type" label="Carousel Type" options={CarouselType} />
        {methods.watch('type') === 'Home-Banner' || methods.watch('type') === 'Main-Banner' ? (
          <>
            <Field.Text name="title" label="Title" />
            <Field.Text name="subtitle" label="SubTitle" />
          </>
        ) : null}

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Content *</Typography>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Link</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Field.Text name="link.text" label="Link Text" />
            <Field.Text name="link.url" label="Link Url" />
          </Box>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Carousel Image *</Typography>
          <Field.Upload name="carouselImg" maxSize={3145728} onDelete={handleRemoveFile} />
        </Stack>
      </Stack>
    </Card>
  );

  if (id && isLoading) return <LoadingScreen />;

  return (
    <>
      <CustomBreadcrumbs
        heading={`${id ? 'Edit' : 'Add'} Carousel`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: `${id ? 'Edit' : 'Add'} Carousel` },
        ]}
        sx={{ mb: 2 }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          {renderDetails}
          <div className="flex justify-end gap-2">
            <span
              onClick={() => navigate(paths.dashboard.customise.carousel.list)}
              className="px-3 py-2 text-white bg-red-600 rounded-md cursor-pointer"
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
        </Stack>
      </Form>
    </>
  );
};

export default AddCarousel;
