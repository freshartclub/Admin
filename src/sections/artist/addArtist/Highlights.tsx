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
import { useSearchParams } from 'src/routes/hooks';
import { getYearDropDown } from 'src/utils/helper';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { Iconify } from 'src/components/iconify';
import { Field, schemaHelper } from 'src/components/hook-form';
import { RenderAllPicklists } from 'src/sections/Picklists/RenderAllPicklist';

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
  const view = useSearchParams().get('view');
  const isReadOnly = view !== null;

  const picklist = RenderAllPicklists(['Event Type', 'Event Scope']);
  const picklistMap = picklist.reduce((acc, item: any) => {
    acc[item?.fieldName] = item?.picklist;
    return acc;
  }, {});

  const eventType = picklistMap['Event Type'];
  const eventScope = picklistMap['Event Scope'];

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
      count: 2,
    }),
    [artistFormData]
  );

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });
  const { trigger, handleSubmit } = formProps;
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
    <Card sx={{ border: '1px solid #E6E6E6' }}>
      <CardHeader title="Add highlight" sx={{ mb: 2 }} />
      <Divider />
      <Field.Editor
        helperText={''}
        required
        disabled={isReadOnly}
        name="highlights"
        sx={{ maxHeight: 480 }}
      />
    </Card>
  );

  const AddCv = (
    <Card sx={{ border: '1px solid #E6E6E6' }}>
      <CardHeader title="Add CV" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
          {fields.map((item, index) => (
            <Stack key={item.id} spacing={1.5}>
              <Box
                columnGap={2}
                rowGap={3}
                alignItems={'center'}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(6, 1fr)' }}
              >
                <Field.SingelSelect
                  disabled={isReadOnly}
                  checkbox
                  name={`cvData[${index}].year`}
                  label="Year"
                  options={getYearDropDown(101)}
                />
                <Field.SingelSelect
                  disabled={isReadOnly}
                  checkbox
                  name={`cvData[${index}].Type`}
                  label="Type"
                  options={eventType ? eventType : []}
                />
                <Field.Text
                  disabled={isReadOnly}
                  name={`cvData[${index}].Description`}
                  label="Description"
                />
                <Field.Text
                  disabled={isReadOnly}
                  name={`cvData[${index}].Location`}
                  label="Location"
                />
                <Field.SingelSelect
                  disabled={isReadOnly}
                  checkbox
                  name={`cvData[${index}].Scope`}
                  label="Scope"
                  options={eventScope ? eventScope : []}
                />
                <Button
                  size="small"
                  color="error"
                  disabled={isReadOnly}
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </Box>
            </Stack>
          ))}
          <Button
            size="small"
            color="primary"
            disabled={isReadOnly}
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={haddCv}
          >
            Add More CV
          </Button>
        </Stack>
      </Stack>
    </Card>
  );

  const viewNext = () => {
    setTabState((prev) => {
      prev[tabIndex].isSaved = true;
      return prev;
    });
    setTabIndex(tabIndex + 1);
  };

  return (
    <FormProvider {...formProps}>
      <form onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }}>
          {renderDetails}
          {AddCv}
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
      </form>
    </FormProvider>
  );
}
