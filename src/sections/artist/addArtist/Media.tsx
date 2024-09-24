
import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect,useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@mui/material';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  MainPhoto: schemaHelper.file({ message: { required_error: 'Main Photo is required!' } }),
  AdditionalImage: schemaHelper.file({ message: { required_error: 'Back Photo is required!' } }),
  InprocessPhoto: schemaHelper.file({ message: { required_error: 'Inprocess Photo is required!' } }),
  MainVedio:schemaHelper.file({ message: { required_error: 'Main video is required!' } }),
  AdditionalVedio:schemaHelper.file({ message: { required_error: 'Additional video is required!' } }),
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
      AdditionalImage: artistFormData?.AdditionalImage || null,
      InprocessPhoto: artistFormData?.InprocessPhoto || null,
      MainVedio: artistFormData?.MainVedio || null,
      AdditionalVedio:artistFormData?.AdditionalVedio || null,

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


  const onSubmit = handleSubmit(async (data) => {
    trigger(undefined, { shouldFocus: true });

    setArtistFormData({ ...artistFormData, ...data });
    setTabIndex(tabIndex + 1);
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;

      return prev;
    });
  });




    const handleRemoveFile = useCallback(() => {
      setValue('MainPhoto', null);
    }, [setValue]);

    const handleRemoveFileone = useCallback(() => {
      setValue('AdditionalImage', null);
    }, [setValue]);

    const handleRemoveFiletwo = useCallback(() => {
      setValue('InprocessPhoto', null);
    }, [setValue]);
 

    const handleRemoveFileVideo = useCallback(() => {
      setValue('MainVedio', null);
    }, [setValue]);

    const handleRemoveFileVideotwo = useCallback(() => {
      setValue('AdditionalVedio', null);
    }, [setValue]);
  

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
            <Field.Upload name="MainPhoto" maxSize={3145728} onDelete={handleRemoveFile} />
          </div>

          <div>
           <Typography variant="AdditionalImage">Additional Image</Typography>
            <Field.Upload name="AdditionalImage" maxSize={3145728} onDelete={handleRemoveFileone} />
          </div>

          <div>
            <Typography variant="InprocessPhoto">Inprocess Photo</Typography>
            <Field.Upload name="InprocessPhoto" maxSize={3145728} onDelete={handleRemoveFiletwo} />
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
            <Field.MultiVideo name="MainVedio" maxSize={5e+7} onDelete={handleRemoveFileVideo} />
          </div>
          <div>
          <Typography variant="AdditionalVedio">Additional Video</Typography>
          <Field.MultiVideo name="AdditionalVedio" maxSize={5e+7} onDelete={handleRemoveFileVideotwo} />
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


