import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Art_provider, ArtworkList, CATAGORY_PLAN_OPTIONS, Collections } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import useAddCatalogMutation from './http/useAddCatalogMutation';
import { useGetCatalogById } from './http/useGetCatalogById';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  catalogName: zod.string().min(1, { message: 'catalogName is required!' }),
  catalogDesc: zod.string().min(1, { message: ' catalogDesc is required!' }),
  artworkList: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  catalogCollection: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  artProvider: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  subPlan: zod.string().min(1, { message: 'plan is required!' }),
  exclusiveCatalog: zod.boolean(),
  catalogImg: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
});

// ----------------------------------------------------------------------

export function AddCatalogForm() {
  const id = useSearchParams().get('id');
  const navigate = useNavigate();
  const { data, isLoading } = useGetCatalogById(id);

  const defaultValues = useMemo(
    () => ({
      catalogName: data?.data?.catalogName || '',
      catalogDesc: data?.data?.catalogDesc || '',
      artworkList: data?.data?.artworkList || [],
      catalogCollection: data?.data?.catalogCollection || [],
      artProvider: data?.data?.artProvider || [],
      subPlan: data?.data?.subPlan || '',
      exclusiveCatalog: data?.data?.exclusiveCatalog || false,
      catalogImg: data?.data?.catalogImg || null,
    }),
    [data?.data]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, setValue, handleSubmit } = methods;

  useEffect(() => {
    if (id && data?.data) {
      reset({
        catalogName: data?.data?.catalogName || '',
        catalogDesc: data?.data?.catalogDesc || '',
        artworkList: data?.data?.artworkList || [],
        catalogCollection: data?.data?.catalogCollection || [],
        artProvider: data?.data?.artProvider || [],
        subPlan: data?.data?.subPlan || '',
        exclusiveCatalog: data?.data?.exclusiveCatalog || false,
        catalogImg: `${data?.url}/users/${data?.data?.catalogImg}` || null,
      });
    }
  }, [data?.data, reset]);

  const { mutate, isPending } = useAddCatalogMutation(id);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      if (!data.catalogImg) {
        toast.error('Image is required');
        return;
      }
      const formData = new FormData();

      if (typeof data.catalogImg === 'string' && !data.catalogImg.includes("https")) {
        formData.append('catalogImg', data.catalogImg);
      } else if (data.catalogImg instanceof File) {
        formData.append('catalogImg', data.catalogImg);
      }

      delete data.catalogImg;

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      await mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveImg = useCallback(() => {
    setValue('catalogImg', null);
  }, [setValue]);

  const optionsIn = [
    {
      label: 'Yes',
      value: true,
    },
    {
      label: 'No',
      value: false,
    },
  ];

  const renderDetails = (
    <>
      <Card sx={{ mb: 2 }}>
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text required name="catalogName" label="Catalog Name" />

          <Field.Text required name="catalogDesc" label="Catalog Discription" multiline rows={4} />

          <Field.Autocomplete
            required
            name="artworkList"
            label="Artwork List"
            placeholder="+ list"
            multiple
            freeSolo
            disableCloseOnSelect
            options={ArtworkList.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
          <Field.Autocomplete
            required
            name="catalogCollection"
            label="Collections"
            placeholder="+ list"
            multiple
            freeSolo
            disableCloseOnSelect
            options={Collections.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
          <Field.Autocomplete
            required
            name="artProvider"
            label="Art Provider"
            placeholder="+ Art"
            multiple
            freeSolo
            disableCloseOnSelect
            options={Art_provider.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Stack>
      </Card>
      <Card>
        <CardHeader title="Exclusive Catalog" sx={{ mb: 1 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.SingelSelect
            required
            checkbox
            name="exclusiveCatalog"
            label="Exclusive Catalog"
            options={optionsIn}
          />
        </Stack>
      </Card>
    </>
  );

  const renderProperties = (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Add Image *" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Upload name="catalogImg" maxSize={3145728} onDelete={handleRemoveImg} />
      </Stack>
    </Card>
  );

  const subscription = (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Subscription Plan" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          required
          checkbox
          name="subPlan"
          label="Subscription Plan"
          options={CATAGORY_PLAN_OPTIONS}
        />
      </Stack>
    </Card>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <CustomBreadcrumbs
        heading="Add Catalog"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add Catalog' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          <div className="grid grid-cols-3  gap-3">
            <div className="col-span-1">
              {renderProperties}
              {subscription}
            </div>
            <div className="col-span-2">
              {renderDetails}
              <div className="flex flex-row justify-end gap-3 mt-8">
                <span
                  onClick={() => navigate(paths.dashboard.artwork.catalog.list)}
                  className="bg-white text-black border py-2 px-3 rounded-md"
                >
                  Cancel
                </span>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  {isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
