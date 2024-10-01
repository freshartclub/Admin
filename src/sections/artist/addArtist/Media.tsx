import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  MainPhoto: schemaHelper.file({ message: { required_error: 'Main Photo is required!' } }),
  AdditionalImage: schemaHelper.files({ required: false }),
  InprocessPhoto: zod.any(),
  MainVedio: schemaHelper.file({ message: { required_error: 'Main video is required!' } }),
  AdditionalVedio: schemaHelper.files({ required: false }),
});

// ----------------------------------------------------------------------

export function Media({
  artistFormData,
  setArtistFormData,
  setTabState,
  setTabIndex,
  tabIndex,
  tabState,
}: AddArtistComponentProps) {
  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      MainPhoto: artistFormData?.MainPhoto || null,
      AdditionalImage: artistFormData?.AdditionalImage || [],
      InprocessPhoto: artistFormData?.InprocessPhoto || null,
      MainVedio: artistFormData?.MainVedio || null,
      AdditionalVedio: artistFormData?.AdditionalVedio || [],
    }),
    [artistFormData]
  );

  console.log(defaultValues);

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = formProps;

  const onSubmit = handleSubmit(async (data) => {
    trigger(undefined, { shouldFocus: true });

    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;

      return prev;
    });
  });

  const handleRemoveMainImage = useCallback(() => {
    setValue('MainPhoto', null);
  }, [setValue]);

  const handleRemoveAdditionalImages = useCallback(() => {
    setValue('AdditionalImage', []);
  }, [setValue]);

  const handleRemoveIndividualAdditionalImage = useCallback(
    (image) => {
      const arr = formProps.getValues('AdditionalImage').filter((val) => val.name !== image.name);
      setValue('AdditionalImage', arr);
    },
    [setValue]
  );

  const handleRemoveInProcessImage = useCallback(() => {
    setValue('InprocessPhoto', null);
  }, [setValue]);

  const handleRemoveMainVideo = useCallback(() => {
    setValue('MainVedio', null);
  }, [setValue]);

  const handleRemoveAdditionalVideos = useCallback(() => {
    setValue('AdditionalVedio', []);
  }, [setValue]);

  const handleRemoveIndividualAdditionalVideo = useCallback(
    (video) => {
      const arr = formProps.getValues('AdditionalVedio').filter((val) => val.name !== video.name);

      setValue('AdditionalVedio', arr);
    },
    [setValue]
  );

  const media = (
    <Card className="mb-6">
      <CardHeader title="Media" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <div>
            <Typography variant="MainPhoto">Main Photo</Typography>
            <Field.Upload name="MainPhoto" maxSize={3145728} onDelete={handleRemoveMainImage} />
          </div>

          <div>
            <Typography variant="AdditionalImage">Additional Image</Typography>
            <Field.Upload
              multiple
              onRemove={handleRemoveIndividualAdditionalImage}
              name="AdditionalImage"
              maxSize={3145728}
              onRemoveAll={handleRemoveAdditionalImages}
            />
          </div>

          <div>
            <Typography variant="InprocessPhoto">Inprocess Photo</Typography>
            <Field.Upload
              name="InprocessPhoto"
              maxSize={3145728}
              onDelete={handleRemoveInProcessImage}
            />
          </div>
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <div>
            <Typography variant="MainVedio">Main Video</Typography>
            <Field.MultiVideo name="MainVedio" maxSize={5e7} onDelete={handleRemoveMainVideo} />
          </div>
          <div>
            <Typography variant="AdditionalVedio">Additional Video</Typography>
            <Field.MultiVideo
              onRemoveAll={handleRemoveAdditionalVideos}
              onRemove={handleRemoveIndividualAdditionalVideo}
              multiple
              name="AdditionalVedio"
              maxSize={5e7}
            />
          </div>
        </Box>
      </Stack>
    </Card>
  );

  return (
    <Form methods={formProps} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }}>
        {media}

        <div className="flex justify-end">
          <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
            Save & Next
          </button>
        </div>
      </Stack>
    </Form>
  );
}
