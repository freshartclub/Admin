import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { useSearchParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  profileImage: schemaHelper.file({ message: { required_error: 'Main Photo is required!' } }),
  additionalImage: schemaHelper.files({ required: false }),
  inProcessImage: zod.any(),
  mainVideo: schemaHelper.file({ message: { required_error: 'Main video is required!' } }),
  additionalVideo: schemaHelper.files({ required: false }),
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
  const view = useSearchParams().get('view');
  const isReadOnly = view !== null;

  const handleSuccess = (data) => {
    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
  };

  const { isPending, mutate } = useAddArtistMutation(handleSuccess);

  const defaultValues = useMemo(
    () => ({
      profileImage: artistFormData?.profileImage || null,
      additionalImage: artistFormData?.additionalImage || [],
      inProcessImage: artistFormData?.inProcessImage || null,
      mainVideo: artistFormData?.mainVideo || null,
      additionalVideo: artistFormData?.additionalVideo || [],
    }),
    [artistFormData]
  );

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

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: 'media',
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    await trigger(undefined, { shouldFocus: true });
    data.count = 4;
    data.isContainsImage = true;

    mutate({ body: data });
  });

  const handleRemoveMainImage = useCallback(() => {
    setValue('profileImage', null);
  }, [setValue]);

  const handleRemoveAdditionalImages = useCallback(() => {
    setValue('additionalImage', []);
  }, [setValue]);

  const handleRemoveIndividualAdditionalImage = useCallback(
    (image) => {
      const arr = formProps.getValues('additionalImage').filter((val) => val.name !== image.name);
      setValue('additionalImage', arr);
    },
    [setValue]
  );

  const handleRemoveInProcessImage = useCallback(() => {
    setValue('inProcessImage', null);
  }, [setValue]);

  const handleRemoveMainVideo = useCallback(() => {
    setValue('mainVideo', null);
  }, [setValue]);

  const handleRemoveAdditionalVideos = useCallback(() => {
    setValue('additionalVideo', []);
  }, [setValue]);

  const handleRemoveIndividualAdditionalVideo = useCallback(
    (video) => {
      const arr = formProps.getValues('additionalVideo').filter((val) => val.name !== video.name);

      setValue('additionalVideo', arr);
    },
    [setValue]
  );

  const viewNext = () => {
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
    setTabIndex(tabIndex + 1);
  };

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
            <Typography variant="profileImage">Main Photo</Typography>
            <Field.Upload
              disabled={isReadOnly}
              name="profileImage"
              maxSize={3145728}
              onDelete={handleRemoveMainImage}
            />
          </div>

          <div>
            <Typography variant="additionalImage">Additional Image</Typography>
            <Field.Upload
              disabled={isReadOnly}
              multiple
              onRemove={handleRemoveIndividualAdditionalImage}
              name="additionalImage"
              maxSize={3145728}
              onRemoveAll={handleRemoveAdditionalImages}
            />
          </div>

          <div>
            <Typography variant="inProcessImage">Inprocess Photo</Typography>
            <Field.Upload
              disabled={isReadOnly}
              name="inProcessImage"
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
            <Typography variant="mainVideo">Main Video</Typography>
            <Field.MultiVideo
              disabled={isReadOnly}
              name="mainVideo"
              maxSize={5e7}
              onDelete={handleRemoveMainVideo}
            />
          </div>
          <div>
            <Typography variant="additionalVideo">Additional Video</Typography>
            <Field.MultiVideo
              disabled={isReadOnly}
              onRemoveAll={handleRemoveAdditionalVideos}
              onRemove={handleRemoveIndividualAdditionalVideo}
              multiple
              name="additionalVideo"
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
          {!isReadOnly ? (
            <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
              {isPending ? 'Loading...' : 'Save & Next'}
            </button>
          ) : (
            <span
              onClick={viewNext}
              className="text-white bg-black rounded-md px-3 py-2 cursor-pointer"
            >
              View Next
            </span>
          )}
        </div>
      </Stack>
    </Form>
  );
}
