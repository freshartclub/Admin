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
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  profileImage: schemaHelper.file({ message: { required_error: 'Profile Photo is required!' } }),
  additionalImage: zod.any(),
  inProcessImage: zod.any(),
  mainVideo: schemaHelper.file({ required: false }).optional(),
  additionalVideo: schemaHelper.file({ required: false }).optional(),
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
  const url = "https://dev.freshartclub.com/images"

  const [percent, setPercent] = useState(0);

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
      isContainsImage: true,
      count: 4,
    }),
    [artistFormData]
  );

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { setValue, trigger, handleSubmit } = formProps;
  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: 'media',
  });

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });
    if (!data.profileImage) {
      return toast.error('Main Photo is required!');
    }
    data.count = 4;
    data.isContainsImage = true;

    mutate({
      body: data,
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.floor((loaded * 100) / total);

        setPercent(percentCompleted);
      },
    });
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
            <Typography>Profile Photo *</Typography>
            <Field.Upload
              disabled={isReadOnly}
              required
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
            <Typography>Main Video</Typography>
            <Field.Upload
              disabled={isReadOnly}
              name="mainVideo"
              accept="video/*"
              onDelete={handleRemoveMainVideo}
            />
          </div>
          <div>
            <Typography>Additional Video</Typography>
            <Field.MultiVideo
              disabled={isReadOnly}
              accept="video/*"
              onRemoveAll={handleRemoveAdditionalVideos}
              onRemove={handleRemoveIndividualAdditionalVideo}
              multiple
              name="additionalVideo"
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
              {isPending ? 'Saving ' + percent + '%' : 'Save & Next'}
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
