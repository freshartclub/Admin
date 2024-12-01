import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import { toast } from 'sonner';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { useSearchParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  profileImage: schemaHelper.file({ message: { required_error: 'Profile Photo is required!' } }),
  additionalImage: zod.any(),
  inProcessImage: zod.any(),
  mainVideo: schemaHelper.file({ required: false }).optional(),
  additionalVideo: schemaHelper.file({ required: false }).optional(),
  existingImages: zod.any().array().optional(),
  existingVideos: zod.any().array().optional(),
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
  const id = useSearchParams().get('id');

  const isReadOnly = view !== null;
  const url = 'https://dev.freshartclub.com/images';

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

  let imgArr = [];
  let videoArr = [];

  if (id && artistFormData) {
    artistFormData.additionalImage &&
      artistFormData.additionalImage.length > 0 &&
      artistFormData.additionalImage.forEach((item: any, i) => imgArr.push(`${url}/users/${item}`));
    artistFormData.additionalVideo &&
      artistFormData.additionalVideo.length > 0 &&
      artistFormData.additionalVideo.forEach((item: any, i) =>
        videoArr.push(`${url}/videos/${item}`)
      );
  }

  const defaultValues = useMemo(
    () => ({
      profileImage: artistFormData?.profileImage
        ? `${url}/users/${artistFormData?.profileImage}`
        : null,
      additionalImage: imgArr || [],
      inProcessImage: artistFormData?.inProcessImage
        ? `${url}/users/${artistFormData?.inProcessImage}`
        : null,
      mainVideo: artistFormData?.mainVideo ? `${url}/videos/${artistFormData?.mainVideo}` : null,
      additionalVideo: videoArr || [],
      existingImages: artistFormData?.additionalImage || [],
      existingVideos: artistFormData?.additionalVideo || [],
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

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });
    if (!data.profileImage) {
      return toast.error('Main Photo is required!');
    }

    data.count = 4;
    data.isContainsImage = true;
    data.existingImages = formProps.getValues('existingImages');
    data.existingVideos = formProps.getValues('existingVideos');

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
    if (isReadOnly) return;
    setValue('profileImage', null);
  }, [setValue]);

  const handleRemoveAdditionalImages = useCallback(() => {
    if (isReadOnly) return;
    setValue('additionalImage', []);
    setValue('existingImages', []);
  }, [setValue]);

  const handleRemoveIndividualAdditionalImage = useCallback(
    (image) => {
      if (isReadOnly) return;
      const arr = formProps.getValues('additionalImage').filter((val) => val !== image);
      setValue('additionalImage', arr);
      setValue('existingImages', arr);
    },
    [setValue]
  );

  const handleRemoveInProcessImage = useCallback(() => {
    if (isReadOnly) return;
    setValue('inProcessImage', null);
  }, [setValue]);

  const handleRemoveMainVideo = useCallback(() => {
    if (isReadOnly) return;
    setValue('mainVideo', null);
  }, [setValue]);

  const handleRemoveAdditionalVideos = useCallback(() => {
    if (isReadOnly) return;
    setValue('additionalVideo', []);
    setValue('existingVideos', []);
  }, [setValue]);

  const handleRemoveIndividualAdditionalVideo = useCallback(
    (video) => {
      if (isReadOnly) return;
      const arr = formProps.getValues('additionalVideo').filter((val) => val !== video);
      setValue('additionalVideo', arr);
      setValue('existingVideos', arr);
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

  const mainVi = formProps.watch('mainVideo');

  const media = (
    <Card sx={{ border: '1px solid #E0E0E0' }}>
      <CardHeader title="Media" sx={{ mb: 2 }} />
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
            <Typography>Additional Image</Typography>
            <Field.Upload
              required
              multiple
              disabled={isReadOnly}
              thumbnail
              helperText="Only 3 files are allowed at a time (Type accepted: jpg, png, jpeg, webp)"
              name="additionalImage"
              maxSize={3145728}
              onRemove={handleRemoveIndividualAdditionalImage}
              onRemoveAll={handleRemoveAdditionalImages}
            />
            {/* <Field.Upload
              disabled={isReadOnly}
              multiple
              onRemove={handleRemoveIndividualAdditionalImage}
              name="additionalImage"
              maxSize={3145728}
              onRemoveAll={handleRemoveAdditionalImages}
            /> */}
          </div>

          <div>
            <Typography>Inprocess Photo</Typography>
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
            {mainVi ? (
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '100%',
                  pointerEvents: `${isReadOnly ? 'none' : 'auto'}`,
                }}
              >
                <video controls width="100%" height="auto" style={{ borderRadius: '8px' }}>
                  {typeof formProps.getValues('mainVideo') === 'string' ? (
                    <source src={`${formProps.getValues('mainVideo')}`} type="video/mp4" />
                  ) : (
                    <source
                      src={URL.createObjectURL(formProps.getValues('mainVideo'))}
                      type="video/mp4"
                    />
                  )}
                  Your browser does not support the video tag.
                </video>
                <span
                  onClick={handleRemoveMainVideo}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#c4cdd5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '31px',
                    cursor: 'pointer',
                    paddingLeft: '4px',
                    paddingTop: '3px',
                  }}
                  title="Delete Video"
                >
                  ✖
                </span>
              </div>
            ) : (
              <Field.Upload
                disabled={isReadOnly}
                name="mainVideo"
                accept="video/*"
                onDelete={handleRemoveMainVideo}
              />
            )}
          </div>
          <div>
            <Typography>Additional Video</Typography>
            {/* <Field.Upload
              required
              multiple
              disabled={isReadOnly}
              thumbnail
              helperText="Only 3 files are allowed"
              name="additionalVideo"
              maxSize={3145728}
              onRemove={handleRemoveIndividualAdditionalVideo}
              onRemoveAll={handleRemoveAdditionalVideos}
            /> */}
            <Field.MultiVideo
              disabled={isReadOnly}
              thumbnail
              helperText="Only 3 files are allowed at a time"
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
