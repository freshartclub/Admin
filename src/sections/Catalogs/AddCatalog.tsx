import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Avatar, Link, ListItemText, TableCell, TableRow, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Art_provider, CATAGORY_PLAN_OPTIONS } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { useGetSearchedArtworks } from '../Collection-Management/http/useGetSearchedArtworks';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';
import useAddCatalogMutation from './http/useAddCatalogMutation';
import { useGetCatalogById } from './http/useGetCatalogById';
import { useGetSearchCollection } from './http/useGetSearchCollection';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  catalogName: zod.string().min(1, { message: 'catalogName is required!' }),
  catalogDesc: zod.string().min(1, { message: ' catalogDesc is required!' }),
  artworkList: zod.string().array().min(1, { message: 'Must have at least 1 items!' }),
  artworkNames: zod.string().array(),
  catalogCollection: zod.string().array().min(1, { message: 'Must have at least 1 items!' }),
  collectionNames: zod.string().array(),
  catalogCommercialization: zod
    .string()
    .min(1, { message: 'Catalog Commercialization is required!' }),
  defaultArtistFee: zod
    .number()
    .min(1, { message: 'Default Artist Fee is required!' })
    .max(100, { message: 'Default Artist Fee cannot exceed 100!' }),

  artProvider: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  subPlan: zod.string().array().min(1, { message: 'Plan is required!' }),
  exclusiveCatalog: zod.boolean(),
  status: zod.any(),
  catalogImg: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
});

// ----------------------------------------------------------------------

export function AddCatalogForm() {
  const id = useSearchParams().get('id');
  const navigate = useNavigate();
  const { data, isLoading } = useGetCatalogById(id);
  const [search, setSearch] = useState('');
  const [searchColl, setSearchColl] = useState('');

  const picklist = RenderAllPicklist('Catalog Status');

  const searchDebounce = useDebounce(search, 1000);
  const { data: artworkData } = useGetSearchedArtworks(searchDebounce);

  const searchCollDebounce = useDebounce(searchColl, 1000);
  const { data: collData } = useGetSearchCollection(searchCollDebounce);

  const defaultValues = useMemo(
    () => ({
      catalogName: data?.data?.catalogName || '',
      catalogDesc: data?.data?.catalogDesc || '',
      artworkList: data?.data?.artworkList?.map((item) => item?._id) || [],
      artworkNames: data?.data?.artworkList?.map((item) => item?.artworkName) || [],
      catalogCollection: data?.data?.catalogCollection.map((item) => item?._id) || [],
      collectionNames: data?.data?.catalogCollection.map((item) => item?.collectionName) || [],
      artProvider: data?.data?.artProvider || [],
      subPlan: data?.data?.subPlan || [],
      catalogCommercialization: data?.data?.catalogCommercialization || '',
      defaultArtistFee: data?.data?.defaultArtistFee || '',
      exclusiveCatalog: data?.data?.exclusiveCatalog || false,
      status: data?.data?.status || '',
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
        artworkList: data?.data?.artworkList?.map((item) => item?._id) || [],
        artworkNames: data?.data?.artworkList?.map((item) => item?.artworkName) || [],
        catalogCollection: data?.data?.catalogCollection.map((item) => item?._id) || [],
        collectionNames: data?.data?.catalogCollection.map((item) => item?.collectionName) || [],
        artProvider: data?.data?.artProvider || [],
        subPlan: data?.data?.subPlan || [],
        catalogCommercialization: data?.data?.catalogCommercialization || '',
        defaultArtistFee: data?.data?.defaultArtistFee || 0,
        exclusiveCatalog: data?.data?.exclusiveCatalog || false,
        status: data?.data?.status || '',
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

      if (typeof data.catalogImg === 'string' && !data.catalogImg.includes('https')) {
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

  const refillData = (item) => {
    const currentArtworkList = methods.getValues('artworkList') || [];
    const currentArtworkNames = methods.getValues('artworkNames') || [];

    if (!currentArtworkList.includes(item?._id)) {
      setValue('artworkList', [...currentArtworkList, item?._id]);
    }

    if (!currentArtworkNames.includes(item?.artworkName)) {
      setValue('artworkNames', [...currentArtworkNames, item?.artworkName]);
    }

    setSearch('');
  };

  const refillCollData = (item) => {
    const catalogCollection = methods.getValues('catalogCollection') || [];
    const collectionNames = methods.getValues('collectionNames') || [];

    if (!catalogCollection.includes(item?._id)) {
      setValue('catalogCollection', [...catalogCollection, item?._id]);
    }

    if (!collectionNames.includes(item?.collectionName)) {
      setValue('collectionNames', [...collectionNames, item?.collectionName]);
    }

    setSearchColl('');
  };

  const handleRemoveArtwokrk = (index) => {
    const currentArtworkList = methods.getValues('artworkList') || [];
    const currentArtworkNames = methods.getValues('artworkNames') || [];

    setValue(
      'artworkList',
      currentArtworkList.filter((_, i) => i !== index)
    );
    setValue(
      'artworkNames',
      currentArtworkNames.filter((_, i) => i !== index)
    );
  };

  const handleRemoveCollection = (index) => {
    const catalogCollection = methods.getValues('catalogCollection') || [];
    const collectionNames = methods.getValues('collectionNames') || [];

    setValue(
      'catalogCollection',
      catalogCollection.filter((_, i) => i !== index)
    );
    setValue(
      'collectionNames',
      collectionNames.filter((_, i) => i !== index)
    );
  };

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
          <Field.Text required name="catalogDesc" label="Catalog Description" multiline rows={4} />
          <div className="relative">
            <Field.Text
              name="CollectionSearch"
              label="Add Collection To List"
              placeholder="Search by Collection Name"
              value={searchColl}
              onChange={(e) => setSearchColl(e.target.value)}
            />
            {searchColl && (
              <div className="absolute top-16 w-[100%] rounded-lg z-10 h-[30vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto ">
                <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {collData && collData.length > 0 ? (
                    collData.map((i, j) => (
                      <TableCell
                        onClick={() => refillCollData(i)}
                        key={j}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Stack spacing={2} direction="row" alignItems="center">
                          <Avatar alt={i?.collectionName} src={i?.collectionFile} />

                          <ListItemText
                            disableTypography
                            primary={
                              <Typography variant="body2" noWrap>
                                {i?.collectionName}
                              </Typography>
                            }
                            secondary={
                              <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                                {i?.createdBy}
                              </Link>
                            }
                          />
                        </Stack>
                      </TableCell>
                    ))
                  ) : (
                    <TableCell>No Data Available</TableCell>
                  )}
                </TableRow>
              </div>
            )}
          </div>
          {methods.watch('collectionNames') && methods.getValues('collectionNames').length > 0 && (
            <div className="flex flex-wrap gap-2 mt-[-1rem]">
              {methods.getValues('collectionNames').map((i, index) => (
                <Stack
                  direction={'row'}
                  alignItems="center"
                  sx={{
                    display: 'flex',
                    gap: 0.3,
                    backgroundColor: 'rgb(214 244 249)',
                    color: 'rgb(43 135 175)',
                    fontSize: '14px',
                    padding: '3px 7px',
                    borderRadius: '9px',
                  }}
                  key={index}
                >
                  <span>{i}</span>
                  <Iconify
                    icon="material-symbols:close-rounded"
                    sx={{ cursor: 'pointer', padding: '2px' }}
                    onClick={() => handleRemoveCollection(index)}
                  />
                </Stack>
              ))}
            </div>
          )}

          <div className="relative">
            <Field.Text
              name="artworkSearch"
              label="Add Artwork To List"
              placeholder="Search by Artwork Id/Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <div className="absolute top-16 w-[100%] rounded-lg z-10 h-[30vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto ">
                <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {artworkData && artworkData.length > 0 ? (
                    artworkData.map((i, j) => (
                      <TableCell
                        onClick={() => refillData(i)}
                        key={j}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Stack spacing={2} direction="row" alignItems="center">
                          <Avatar alt={i?.artworkName} src={i?.media?.mainImage} />

                          <ListItemText
                            disableTypography
                            primary={
                              <Typography variant="body2" noWrap>
                                {i?.artworkName}
                              </Typography>
                            }
                            secondary={
                              <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                                {i?.inventoryShipping?.pCode}
                              </Link>
                            }
                          />
                        </Stack>
                      </TableCell>
                    ))
                  ) : (
                    <TableCell>No Data Available</TableCell>
                  )}
                </TableRow>
              </div>
            )}
          </div>
          {methods.watch('artworkNames') && methods.getValues('artworkNames').length > 0 && (
            <div className="flex flex-wrap gap-2 mt-[-1rem]">
              {methods.getValues('artworkNames').map((i, index) => (
                <Stack
                  direction={'row'}
                  alignItems="center"
                  sx={{
                    display: 'flex',
                    gap: 0.3,
                    backgroundColor: 'rgb(214 244 249)',
                    color: 'rgb(43 135 175)',
                    fontSize: '14px',
                    padding: '3px 7px',
                    borderRadius: '9px',
                  }}
                  key={index}
                >
                  <span>{i}</span>
                  <Iconify
                    icon="material-symbols:close-rounded"
                    sx={{ cursor: 'pointer', padding: '2px' }}
                    onClick={() => handleRemoveArtwokrk(index)}
                  />
                </Stack>
              ))}
            </div>
          )}

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
          <Field.SingelSelect
            required
            name="catalogCommercialization"
            label="Catalog Commercialization"
            options={[
              { value: 'Purchase', label: 'Purchase' },
              { value: 'Subscription ', label: 'Subscription ' },
            ]}
          />
          <Field.Text required name="defaultArtistFee" label="Default Artist Fee" type="number" />
          <Field.SingelSelect
            required
            name="status"
            label="Status"
            options={picklist ? picklist : []}
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
        <Field.Autocomplete
          required
          name="subPlan"
          label="Subscription Plan *"
          placeholder="+ Subscription Plan"
          multiple
          freeSolo
          disableCloseOnSelect
          options={CATAGORY_PLAN_OPTIONS.map((option) => option.value)}
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
        {/* <Field.SingelSelect
          required
          checkbox
          name="subPlan"
          label="Subscription Plan"
          options={CATAGORY_PLAN_OPTIONS}
        /> */}
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
