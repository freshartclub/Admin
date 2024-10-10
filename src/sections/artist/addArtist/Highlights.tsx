import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { getYearDropDown } from 'src/utils/helper';

import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';

import { Iconify } from 'src/components/iconify';
import { Field, schemaHelper } from 'src/components/hook-form';

export const NewProductSchema = zod.object({
  highlights: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  cvData: zod.array(
    zod.object({
      year: zod.string().min(1, { message: 'Year is required!' }),
      Type: zod.string().min(1, { message: 'Type is required!' }),
      Description: zod.string().min(1, { message: 'Description is required!' }),
      Location: zod.string().optional(),
      Scope: zod.string().optional(),
    })
  ),
});

export function Highlights({
  artistFormData,
  setArtistFormData,
  setTabState,
  setTabIndex,
  tabIndex,
  tabState,
}: AddArtistComponentProps) {
  const router = useRouter();
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
      highlights: artistFormData?.highlights,
      cvData: artistFormData?.cvData,
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
  const { fields, append, remove } = useFieldArray({ control: formProps.control, name: 'cvData' });

  const handleRemove = (index) => {
    remove(index);
  };

  const haddCv = () => {
    append({
      year: '',
      Type: '',
      Description: '',
      Location: '',
      Scope: '',
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    await trigger(undefined, { shouldFocus: true });

    data.count = 2;

    mutate({ body: data });
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Add highlights" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Highlights</Typography>
          <Field.Editor name="highlights" sx={{ maxHeight: 480 }} />
        </Stack>
      </Stack>
    </Card>
  );

  const AddCv = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
          {fields.map((item, index) => (
            <Stack
              key={item.id}
              aligncvs={{ xs: 'flex-center', md: 'flex-end' }}
              spacing={1.5}
              className=""
            >
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(5, 1fr)' }}
              >
                <Field.SingelSelect
                  checkbox
                  name={`cvData[${index}].year`}
                  label="Year"
                  options={getYearDropDown(101)}
                />
                <Field.Text name={`cvData[${index}].Type`} label="Type" />
                <Field.Text name={`cvData[${index}].Description`} label="Description" />
                <Field.Text name={`cvData[${index}].Location`} label="Location" />
                <Field.Text name={`cvData[${index}].Scope`} label="Scope" />
              </Box>

              <Button
                size="small"
                color="error"
                className="flex justify-end"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </Stack>
          ))}
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={haddCv}
          >
            Add More CV
          </Button>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <FormProvider {...formProps}>
      <form onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          {renderDetails}
          {AddCv}
          <div className="flex justify-end">
            <button className="text-white bg-black rounded-md px-3 py-2" type="submit">
              {isPending ? 'Loading...' : 'Save & Next'}
            </button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  );
}
