import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';
import { z as zod } from 'zod';

import { Avatar, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useWatch } from 'react-hook-form';
import { Field, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import useAddArtistMutation from 'src/http/createArtist/useAddArtistMutation';
import { useSearchParams } from 'src/routes/hooks';
import { useGetInsigniaList } from 'src/sections/CredentialList/http/useGetInsigniaList';
import { useGetDisciplineMutation } from 'src/sections/DisciplineListCategory/http/useGetDisciplineMutation';
import { RenderAllPicklist } from 'src/sections/Picklists/RenderAllPicklist';
import { useGetStyleListMutation } from 'src/sections/StyleListCategory/http/useGetStyleListMutation';

// ----------------------------------------------------------------------

export const ArtistCatagory = zod.object({
  category: zod.string({ required_error: 'Category one is required!' }),
  styleone: zod.string({ required_error: 'Style 1 is required!' }),
  styletwo: zod.string({ required_error: 'Style 2 is required!' }),
});

export const NewProductSchema = zod.object({
  About: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  insignia: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  link: zod.array(
    zod.object({
      name: zod.string().min(1, { message: 'Name is required!' }),
      link: zod.string().refine(
        (val) => {
          try {
            new URL(val);
            return val.includes('https://') || val.includes('http://');
          } catch (e) {
            return false;
          }
        },
        { message: 'URL must be a valid URL' }
      ),
    })
  ),
  discipline: zod.array(
    zod.object({
      discipline: zod.string().min(1, { message: 'Discipline is required!' }),
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
  const { data: disciplineData } = useGetDisciplineMutation();
  const { data: styleData } = useGetStyleListMutation();
  const renderPicklist = RenderAllPicklist('Social Media');

  const PRODUCT_CATAGORYONE_OPTIONS =
    disciplineData && disciplineData.length > 0
      ? disciplineData
          .filter((item: any) => !item.isDeleted)
          .map((item: any) => ({
            value: item?.disciplineName,
            label: item?.disciplineName,
          }))
      : [];

  let arr: any = [];
  const PRODUCT_STYLE_OPTIONS =
    styleData && styleData.length > 0
      ? styleData
          .filter((item: any) => !item.isDeleted)
          .map((item: any) => {
            let localObj: any = {
              value: '',
              label: '',
              disciplineName: [],
            };

            localObj.value = item?.styleName;
            localObj.label = item?.styleName;
            localObj.disciplineName =
              item?.discipline &&
              item?.discipline.length > 0 &&
              item?.discipline.map((item: any) => item?.disciplineName);

            arr.push(localObj);

            return arr;
          })
      : [];

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
  const { data } = useGetInsigniaList();

  const defaultValues = useMemo(
    () => ({
      About: artistFormData?.about || '',
      insignia: artistFormData?.insignia || [],
      discipline: artistFormData?.discipline || '',
      link: artistFormData?.link || '',
      count: 3,
    }),
    [artistFormData]
  );

  const formProps = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { trigger, setValue, watch, handleSubmit } = formProps;

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: 'discipline',
  });

  const {
    fields: socialFields,
    append: socialAppend,
    remove: socialRemove,
  } = useFieldArray({
    control: formProps.control,
    name: 'link',
  });

  const selectedLinks = useWatch({
    control: formProps.control,
    name: 'link',
  });

  const selectedDisciplines = useWatch({
    control: formProps.control,
    name: 'discipline',
  });

  const handleRemove = (index) => {
    remove(index);
  };

  const handleSocialRemove = (index) => {
    socialRemove(index);
  };

  const addArtistCategory = () => {
    append({
      discipline: '',
      style: [],
    });
  };

  const addArtistSocialLinks = () => {
    socialAppend({
      name: '',
      link: '',
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    const newData = {
      about: data.About,
      discipline: data.discipline,
      insignia: data.insignia,
      link: data.link,
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

  const filterSocialLinks = (index) => {
    const selectedLinksValues = selectedLinks ? selectedLinks.map((name) => name.name) : [];
    return renderPicklist.filter(
      (option) =>
        !selectedLinksValues.includes(option.value) || option.value === selectedLinks[index]?.name
    );
  };

  const filterStylesForDiscipline = (selectedDiscipline) => {
    return arr.filter((style) => style.disciplineName.includes(selectedDiscipline));
  };

  const handleSocialLinkOpen = (index) => {
    window.open(selectedLinks[index]?.link, '_blank');
  };

  const renderDetails = (
    <Card sx={{ mb: 1 }}>
      <CardHeader title="About Artist" sx={{ mb: 2 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Editor required disabled={isReadOnly} name="About" sx={{ maxHeight: 480 }} />
      </Stack>
    </Card>
  );

  const ArtistInsignia = (
    <Card sx={{ mb: 1 }}>
      <CardHeader title="Artist Insignia" sx={{ mb: 2 }} />
      <Divider />

      <Stack sx={{ paddingLeft: 2, mb: 3, mt: 2 }}>
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
            data?.data && data?.data?.length > 0
              ? data?.data.filter((option) => option.isDeleted === false)
              : []
          }
          getOptionLabel={(option) => option.credentialName}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderOption={(props, option) => (
            <div className="flex items-center gap-4" {...props} key={option._id}>
              <Avatar
                alt={option?.credentialName}
                src={`${data?.url}/users/${option?.insigniaImage}`}
              />
              <span className="ml-2">{option.credentialName}</span>
            </div>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={index}
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
            data?.data && data?.data?.length > 0
              ? data?.data?.filter((item) => watch('insignia').includes(item._id))
              : []
          }
        />
      </Stack>
    </Card>
  );

  const ArtistSocialLinks = (
    <Card sx={{ mb: 1 }}>
      <CardHeader title="Artist Social Links" sx={{ mb: 2 }} />
      <Divider />

      <Stack spacing={3} mb={3} sx={{ paddingLeft: 2 }}>
        {socialFields.length === renderPicklist.length ? null : (
          <div className="flex justify-end">
            <Button
              disabled={isReadOnly}
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addArtistSocialLinks}
            >
              {selectedLinks.length > 0 ? 'Add More Links' : 'Add Link'}
            </Button>
          </div>
        )}
        <Stack sx={{ paddingLeft: 2 }} spacing={2} mb={2}>
          {socialFields.map((item, index) => (
            <Box
              key={index}
              columnGap={2}
              alignItems={'center'}
              rowGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 1fr 0.3fr' }}
            >
              <Field.SingelSelect
                disabled={isReadOnly}
                required
                checkbox
                name={`link[${index}].name`}
                label={`Social Link ${index + 1}`}
                options={filterSocialLinks(index)}
              />

              <Field.Text disabled={isReadOnly} required name={`link[${index}].link`} label="Url" />

              <Box>
                {selectedLinks[index]?.link ? (
                  <Button
                    disabled={isReadOnly}
                    size="small"
                    color="primary"
                    className="flex justify-end"
                    startIcon={<Iconify icon="majesticons:open" />}
                    onClick={() => handleSocialLinkOpen(index)}
                  >
                    Open Link
                  </Button>
                ) : null}
                <Button
                  disabled={isReadOnly}
                  size="small"
                  color="error"
                  className="flex justify-end"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={() => handleSocialRemove(index)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Card>
  );

  const ArtistCatagory = (
    <Card sx={{ mb: 2 }}>
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
              {selectedDisciplines.length > 0 ? 'Add More Discipline' : 'Add Discipline'}
            </Button>
          </div>
        )}
        <Stack spacing={1.5} className="mb-3">
          {fields.map((item, index) => (
            <Box
              key={index}
              columnGap={2}
              alignItems={'center'}
              rowGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: '1fr 1fr 0.3fr' }}
            >
              <Field.SingelSelect
                disabled={isReadOnly}
                required
                checkbox
                name={`discipline[${index}].discipline`}
                label={`Discipline ${index + 1}`}
                options={filterOptions(index)}
              />

              <Field.MultiSelect
                checkbox
                required
                disabled={isReadOnly}
                name={`discipline[${index}].style`}
                label="Style"
                options={
                  selectedDisciplines && selectedDisciplines[index]
                    ? filterStylesForDiscipline(selectedDisciplines[index].discipline)
                    : []
                }
              />

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
            </Box>
          ))}
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
        <Stack spacing={{ xs: 3, md: 3 }}>
          <div className="">
            <div className="">
              {renderDetails}
              {ArtistInsignia}
              {ArtistSocialLinks}
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
