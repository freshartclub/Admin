import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSearchParams } from 'src/routes/hooks';
import { PRODUCT_STYLE_OPTIONS, PRODUCT_CATAGORYONE_OPTIONS } from 'src/_mock';
import { useWatch } from 'react-hook-form';
import { Iconify } from 'src/components/iconify';
import { Field, schemaHelper } from 'src/components/hook-form';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { useGetInsigniaList } from 'src/sections/CredentialList/http/useGetInsigniaList';
import { Avatar } from '@mui/material';
import { Chip } from '@mui/material';

// ----------------------------------------------------------------------

export const ArtistCatagory = zod.object({
  category: zod.string({ required_error: 'Category one is required!' }),
  styleone: zod.string({ required_error: 'Style 1 is required!' }),
  styletwo: zod.string({ required_error: 'Style 2 is required!' }),
});

export const NewProductSchema = zod.object({
  About: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  insignia: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  discipline: zod.array(
    zod.object({
      discipline: zod.string().min(1, { message: 'Catagory1 is required!' }),
      style: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
    })
  ),
});

// ----------------------------------------------------------------------

export function AboutArtist({
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
  const { data, isLoading } = useGetInsigniaList();

  const defaultValues = useMemo(
    () => ({
      About: artistFormData?.about || '',
      insignia: artistFormData?.insignia || [],
      discipline: artistFormData?.discipline || '',
      count: 3,
    }),
    [artistFormData]
  );

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    trigger,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = formProps;

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: 'discipline',
  });

  const selectedDisciplines = useWatch({
    control: formProps.control,
    name: 'discipline',
  });

  const handleRemove = (index) => {
    remove(index);
  };

  const addArtistCategory = () => {
    append({
      discipline: '',
      style: [],
      insignia: [],
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    const newData = {
      about: data.About,
      discipline: data.discipline,
      insignia: data.insignia,
      count: 3,
    };

    try {
      await trigger(undefined, { shouldFocus: true });
      mutate({ body: newData });
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  });

  const filterOptions = (index) => {
    const selectedValues =
      selectedDisciplines && selectedDisciplines?.map((item) => item.discipline);
    return PRODUCT_CATAGORYONE_OPTIONS.filter(
      (option) =>
        !selectedValues.includes(option.value) ||
        option.value === selectedDisciplines[index]?.discipline
    );
  };

  const renderDetails = (
    <Card sx={{ mb: 1 }}>
      <CardHeader title="About Artist" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">About</Typography>
          <Field.Editor required disabled={isReadOnly} name="About" sx={{ maxHeight: 480 }} />
        </Stack>
      </Stack>
    </Card>
  );

  const ArtistInsignia = (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Artist Insignia" sx={{ mb: 2 }} />

      <Stack sx={{ paddingLeft: 2, mb: 3 }}>
        <Field.Autocomplete
          disabled={isReadOnly}
          name="insignia"
          required
          label="Add Insignia"
          placeholder="Add Insignia"
          multiple
          freeSolo
          disableCloseOnSelect
          options={
            data && data.length > 0 ? data.filter((option) => option.isDeleted === false) : []
          }
          getOptionLabel={(option) => option.credentialName}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderOption={(props, option) => (
            <div className="flex items-center gap-4" {...props} key={option._id}>
              <Avatar alt={option?.credentialName} src={option?.insigniaImage} />
              <span className="ml-2">{option.credentialName}</span>
            </div>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option._id}
                label={option.credentialName}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
          onChange={(event, value) => {
            const selectedIds = value.map((item) => item._id);
            setValue('insignia', selectedIds);
          }}
          value={
            data && data.length > 0
              ? data.filter((item) => watch('insignia').includes(item._id))
              : []
          }
        />
      </Stack>
    </Card>
  );

  const ArtistCatagory = (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Artist Discipline" sx={{ mb: 1 }} />
      <Divider />

      <Stack spacing={3} sx={{ paddingLeft: 2 }}>
        {fields.length === PRODUCT_CATAGORYONE_OPTIONS.length ? null : (
          <div className="flex justify-end">
            <Button
              disabled={isReadOnly}
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addArtistCategory}
            >
              Add More Discipline
            </Button>
          </div>
        )}
        {fields.map((item, index) => (
          <Stack
            key={item.id}
            aligncvs={{ xs: 'flex-center', md: 'flex-end' }}
            spacing={1.5}
            className="mb-7"
          >
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
            >
              <Field.SingelSelect
                disabled={isReadOnly}
                required
                checkbox
                name={`discipline[${index}].discipline`}
                label={`Discipline ${index + 1}`}
                options={filterOptions(index)}
              />
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
              >
                <Field.MultiSelect
                  checkbox
                  required
                  disabled={isReadOnly}
                  name={`discipline[${index}].style`}
                  label="Style"
                  options={PRODUCT_STYLE_OPTIONS}
                />
              </Box>
            </Box>

            <div className="flex justify-end mb-2">
              <Button
                disabled={isReadOnly}
                size="small"
                color="error"
                className="flex justify-end"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </div>
          </Stack>
        ))}
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
          <div className="">
            <div className="">
              {renderDetails}
              {ArtistInsignia}

              {ArtistCatagory}
            </div>
          </div>
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
