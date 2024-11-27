import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Box,
  Button,
  InputAdornment,
  Link,
  ListItemText,
  TableCell,
  TableRow,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
  COLLECTION_CREATED_OPTIONS,
  COLLECTION_STATUS_OPTIONS,
  COLLECTION_TAGS_OPTIONS,
} from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { useSearchParams } from 'src/routes/hooks';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { fData } from 'src/utils/format-number';
import { z as zod } from 'zod';
import useAddCollectionMutation from './http/useAddCollectionMutation';
import { useGetCollectionById } from './http/useGetCollectionById';
import { useGetSearchedArtworks } from './http/useGetSearchedArtworks';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  collectionName: zod.string().min(1, { message: 'name is required!' }),
  collectionDesc: schemaHelper.editor({
    message: { required_error: 'Description is required!' },
  }),
  createdBy: zod.string().min(1, { message: ' Creatar is required!' }),
  artworkList: zod
    .array(
      zod.object({
        artworkId: zod.string().min(1, { message: 'Artwork is required!' }),
        artwork: zod.string().min(1, { message: 'Artwork Name is required!' }),
        artworkDesc: zod.string().min(1, { message: 'Artwork Description is required!' }),
        pCode: zod.string().optional(),
      })
    )
    .min(1, { message: 'Artwork is required!' }),
  expertDesc: zod.string().min(1, { message: ' Description is required!' }),
  expertImg: schemaHelper.file({ required: false }).optional(),
  collectionFile: schemaHelper.file({ required: false }).optional(),
  artworkTags: zod.string().array().min(1, { message: 'Artwork Tags is required!' }),
  status: zod.string().min(1, { message: 'status is required!' }),
});

// ----------------------------------------------------------------------

export function AddCollectionForm() {
  const [search, setSearch] = useState({
    search: '',
    index: null,
  });
  const id = useSearchParams().get('id');
  const navigate = useNavigate();
  const { data, isLoading } = useGetCollectionById(id);

  const defaultValues = useMemo(
    () => ({
      collectionName: data?.data?.collectionName || '',
      collectionDesc: data?.data?.collectionDesc || '',
      createdBy: data?.data?.createdBy || '',
      artworkList: data?.data?.artworkList || [
        { artwork: '', artworkDesc: '', pCode: '', artworkId: '' },
      ],
      expertDesc: data?.data?.expertDetails?.expertDesc || '',
      expertImg: data?.data?.expertDetails?.expertImg || null,
      collectionFile: data?.data?.collectionFile || null,
      artworkTags: data?.data?.artworkTags || [],
      status: data?.data?.status || '',
    }),
    [data?.data]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const searchDebounce = useDebounce(search.search, 1000);
  const { data: artworkData, refetch } = useGetSearchedArtworks(searchDebounce);

  useEffect(() => {
    if (methods.getValues(`artworkList[${search.index}].artwork`) !== '') {
      refetch();
    }
  }, [search.search]);

  const { reset, watch, setValue, handleSubmit } = methods;
  const values = watch();

  useEffect(() => {
    if (id && data?.data) {
      reset({
        collectionName: data?.data?.collectionName || '',
        collectionDesc: data?.data?.collectionDesc || '',
        createdBy: data?.data?.createdBy || '',
        artworkList:
          data?.data?.artworkList.map((item) => ({
            artwork: item?.artworkId?.artworkName,
            artworkDesc: item.artworkDesc,
            pCode: item.artworkId?.inventoryShipping?.pCode,
            artworkId: item.artworkId?._id,
          })) || [],
        expertDesc: data?.data?.expertDetails?.expertDesc || '',
        expertImg: `${data?.url}/users/${data?.data?.expertDetails?.expertImg}` || null,
        collectionFile: data?.data?.collectionFile || null,
        artworkTags: data?.data?.artworkTags || [],
        status: data?.data?.status || '',
      });
    }
  }, [data?.data, reset]);

  const { mutate, isPending } = useAddCollectionMutation(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.collectionFile) {
        toast.error('File is required');
        return;
      }
      if (!data.expertImg) {
        toast.error('Expert Image is required');
        return;
      }

      const formData = new FormData();

      if (data.collectionFile instanceof File) {
        formData.append('collectionFile', data.collectionFile);
      }

      if (data.expertImg instanceof File) {
        formData.append('expertImg', data.expertImg);
      }

      delete data.collectionFile;
      delete data.expertImg;

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => {
            if (key === 'artworkList') {
              formData.append(key, JSON.stringify(item));
            } else {
              formData.append(key, item);
            }
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

  const handleRemoveFile = () => {
    setValue('collectionFile', null);
  };

  const handleRemoveExpertImage = () => {
    setValue('expertImg', null);
  };

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'artworkList',
  });

  const handleRemove = (index) => {
    remove(index);
  };
  const addArtworkList = () => {
    append({ artwork: '', artworkDesc: '', pCode: '', artworkId: '' });
  };

  const refillData = (i, index) => {
    setValue(`artworkList[${index}].artworkId`, i?._id);
    setValue(`artworkList[${index}].artwork`, i?.artworkName);
    setValue(`artworkList[${index}].pCode`, i?.inventoryShipping?.pCode);
    setSearch({ search: '', index: null });
  };

  const mainVi = methods.watch('collectionFile');

  const getValue = (index) => {
    return methods.getValues(`artworkList[${index}].artwork`)
      ? methods.getValues(`artworkList[${index}].artwork`) +
          ' -  ' +
          methods.getValues(`artworkList[${index}].pCode`)
      : search.index === index
        ? search.search
        : '';
  };

  const removeText = (index) => {
    setValue(`artworkList[${index}].artwork`, '');
    setValue(`artworkList[${index}].pCode`, '');
    setSearch({ search: '', index: null });
  };

  const renderDetails = (
    <Card>
      <CardHeader title="General Information" sx={{ mb: 1 }} />
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="collectionName" label="Collection Name" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Collection Description</Typography>
          <Field.Editor name="collectionDesc" sx={{ maxHeight: 480 }} />
        </Stack>

        <Field.SingelSelect
          checkbox
          name="createdBy"
          label="Created By"
          options={COLLECTION_CREATED_OPTIONS}
        />

        <Stack>
          <div className="flex justify-end">
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addArtworkList}
            >
              {fields.length === 0 ? 'Add Artworks' : 'Add More Artworks'}
            </Button>
          </div>
          {fields.map((item, index) => (
            <Stack key={index} spacing={1.5}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
              >
                <div className="relative">
                  <Field.Text
                    name={`artworkList[${index}].artwork`}
                    label="Artwork Name"
                    placeholder="Search by artwork Id/Name"
                    value={getValue(index)}
                    onChange={(e) => setSearch({ search: e.target.value, index: index, code: '' })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box
                            onClick={() => removeText(index)}
                            component="span"
                            sx={{ color: 'text.disabled', fontSize: '0.85rem', cursor: 'pointer' }}
                          >
                            X
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {search.index === index && search.search && (
                    <div className="absolute top-16 w-[100%] rounded-lg z-10 h-[30vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto ">
                      <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {artworkData && artworkData.length > 0 ? (
                          artworkData.map((i, j) => (
                            <TableCell
                              onClick={() => refillData(i, index)}
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
                <Field.Text
                  sx={{ mb: fields.length > 1 ? 2 : 0 }}
                  required
                  name={`artworkList[${index}].artworkDesc`}
                  label="Artwork Description"
                  multiline
                  rows={4}
                />
              </Box>

              {index > 0 && (
                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              )}
            </Stack>
          ))}
        </Stack>

        <Typography variant="subtitle2">Experts Details</Typography>
        <div className="mb-3 border border-gray-200 rounded-md p-4">
          <Field.Upload
            name="expertImg"
            maxSize={3145728}
            onDelete={handleRemoveExpertImage}
            helperText={
              <Typography
                variant="caption"
                sx={{
                  mt: 3,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.disabled',
                }}
              >
                Allowed *.jpeg, *.jpg, *.png - max size of {fData(3145728)}
              </Typography>
            }
          />
        </div>

        <Field.Text name="expertDesc" label="Experts Description" multiline rows={4} />
      </Stack>
    </Card>
  );

  if (isLoading) return <LoadingScreen />;

  const renderProperties = (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Upload File" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        {mainVi ? (
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '100%',
            }}
          >
            {(() => {
              const file = methods.getValues('collectionFile');

              const isVideo =
                typeof file === 'string'
                  ? file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mkv')
                  : file.type.startsWith('video');

              if (isVideo) {
                return (
                  <video controls width="100%" height="auto" style={{ borderRadius: '8px' }}>
                    <source
                      src={
                        typeof file === 'string'
                          ? `${data?.url}/videos/${file}`
                          : URL.createObjectURL(file)
                      }
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                );
              } else {
                return (
                  <img
                    src={
                      typeof file === 'string'
                        ? `${data?.url}/users/${file}`
                        : URL.createObjectURL(file)
                    }
                    alt="Uploaded content"
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                  />
                );
              }
            })()}
            <span
              onClick={handleRemoveFile}
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
              title="Delete"
            >
              ✖
            </span>
          </div>
        ) : (
          <Field.Upload
            name="collectionFile"
            accept="video/*, image/*"
            onDelete={handleRemoveFile}
          />
        )}
      </Stack>
    </Card>
  );

  const subscription = (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Artwork Tags" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.MultiSelect
          multiple
          checkbox
          name="artworkTags"
          label="Artwork Tags"
          options={COLLECTION_TAGS_OPTIONS}
        />
      </Stack>
    </Card>
  );

  const exclusive = (
    <Card>
      <CardHeader title="Status of Collections" sx={{ mb: 1 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.SingelSelect
          checkbox
          name="status"
          label="Artwork Status"
          options={COLLECTION_STATUS_OPTIONS}
        />
      </Stack>
    </Card>
  );

  return (
    <div>
      <CustomBreadcrumbs
        heading={`${id ? 'Edit' : 'Add'} Collection`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: `${id ? 'Edit' : 'Add'} Collection` },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          <div className="grid grid-cols-3  gap-3">
            <div className="col-span-2">
              {renderDetails}
              <div className="flex flex-row justify-end gap-3 mt-8">
                <span
                  onClick={() => navigate(paths.dashboard.artwork.collection_management.list)}
                  className="bg-white text-black border py-2 px-3 rounded-md cursor-pointer"
                >
                  Cancel
                </span>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  {isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="col-span-1">
              {subscription}
              {renderProperties}
              {exclusive}
            </div>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
