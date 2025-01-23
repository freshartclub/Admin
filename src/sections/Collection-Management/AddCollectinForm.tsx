import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { COLLECTION_STATUS_OPTIONS } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { useSearchParams } from 'src/routes/hooks';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { imgUrl } from 'src/utils/BaseUrls';
import { fData } from 'src/utils/format-number';
import { z as zod } from 'zod';
import useAddCollectionMutation from './http/useAddCollectionMutation';
import useDeleteArtworkColl from './http/useDeleteArtworkColl';
import { useGetCollectionById } from './http/useGetCollectionById';
import { useGetSearchedArtworks } from './http/useGetSearchedArtworks';
import { useBoolean } from 'src/hooks/use-boolean';

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
        artistName: zod.string().optional(),
        artworkImg: schemaHelper.file({ required: false }).optional(),
        isBackend: zod.boolean().optional(),
      })
    )
    .min(1, { message: 'At least one Artwork is required!' }),
  expertDesc: zod.string().min(1, { message: ' Description is required!' }),
  expertImg: schemaHelper.file({ required: false }).optional(),
  collectionFile: schemaHelper.file({ required: false }).optional(),
  collectionTags: zod.string().array().min(1, { message: 'Artwork Tags is required!' }),
  status: zod.string().min(1, { message: 'status is required!' }),
});

// ----------------------------------------------------------------------

export function AddCollectionForm() {
  const confirm = useBoolean();
  const [search, setSearch] = useState({
    search: '',
    index: null,
  });
  const [open, setOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const id = useSearchParams().get('id');
  const navigate = useNavigate();

  const { data, isLoading } = useGetCollectionById(id);

  const defaultValues = useMemo(
    () => ({
      collectionName: data?.collectionName || '',
      collectionDesc: data?.collectionDesc || '',
      artworkList: data?.artworkList || [
        {
          artwork: '',
          artworkDesc: '',
          pCode: '',
          artworkId: '',
          artistName: '',
          artworkImg: null,
          isBackend: false,
        },
      ],
      expertDesc: data?.expertDetails?.expertDesc || '',
      expertImg: data?.expertDetails?.expertImg || null,
      createdBy: data?.expertDetails?.createdBy || '',
      collectionFile: data?.collectionFile || null,
      collectionTags: data?.collectionTags || [],
      status: data?.status || 'Draft',
    }),
    [data]
  );

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.nickName) fullName += ' ' + `"${val?.nickName}"`;
    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const searchDebounce = useDebounce(search.search, 800);
  const {
    data: artworkData,
    refetch,
    isLoading: isLoadingArtwork,
  } = useGetSearchedArtworks(searchDebounce);

  useEffect(() => {
    if (methods.getValues(`artworkList[${search.index}].artwork`) !== '') {
      refetch();
    }
  }, [search.search]);

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;
  const values = watch();

  useEffect(() => {
    if (id && data) {
      reset({
        collectionName: data?.collectionName || '',
        collectionDesc: data?.collectionDesc || '',
        artworkList:
          data?.artworkList.map((item) => ({
            artwork: item?.artworkId?.artworkName,
            artworkDesc: item.artworkDesc,
            pCode: item.artworkId?.artworkId,
            artworkId: item.artworkId?._id,
            artistName: name(item.artworkId?.owner),
            artworkImg: `${imgUrl}/users/${item.artworkId?.media?.mainImage}` || null,
            isBackend: true,
          })) || [],
        expertDesc: data?.expertDetails?.expertDesc || '',
        expertImg: `${imgUrl}/users/${data?.expertDetails?.expertImg}` || null,
        createdBy: data?.expertDetails?.createdBy || '',
        collectionFile: data?.collectionFile || null,
        collectionTags: data?.collectionTags || [],
        status: data?.status || 'Draft',
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useAddCollectionMutation(id);
  const { mutate: deleteArtwork, isPending: isPendingDelete } = useDeleteArtworkColl(id);

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
    append({
      artwork: '',
      artworkDesc: '',
      pCode: '',
      artworkId: '',
      artistName: '',
      artworkImg: null,
    });
  };

  const refillData = (i, index) => {
    setValue(`artworkList[${index}].artworkId`, i?._id);
    setValue(`artworkList[${index}].artwork`, i?.artworkName);
    setValue(`artworkList[${index}].pCode`, i?.artworkId);
    setValue(`artworkList[${index}].artistName`, name(i));
    setValue(`artworkList[${index}].artworkImg`, `${imgUrl}/users/${i?.media}`);
    setSearch({ search: '', index: null });
  };

  const mainVi = methods.watch('collectionFile');

  const getValue = (index) => {
    return methods.getValues(`artworkList[${index}].artwork`)
      ? methods.getValues(`artworkList[${index}].artwork`) +
          ` (${methods.getValues(`artworkList[${index}].pCode`)})`
      : search.index === index
        ? search.search
        : '';
  };

  const removeText = (index) => {
    setValue(`artworkList[${index}].artwork`, '');
    setValue(`artworkList[${index}].artworkId`, '');
    setValue(`artworkList[${index}].pCode`, '');
    setValue(`artworkList[${index}].artistName`, '');
    setValue(`artworkList[${index}].artworkImg`, '');
    setSearch({ search: '', index: null });
  };

  const handleDeleteArtwork = (item) => {
    const data = {
      artworkId: item.artworkId,
    };
    deleteArtwork(data);
    setOpen(false);
  };

  const handleDeleteOption = (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>{`Delete Artwork - ${selectedArtwork?.artwork}`}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <DialogContentText>{`Are you sure want to delete this artwork from collection - "${data?.collectionName}" ?`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => handleDeleteArtwork(selectedArtwork)}
          className="text-white bg-red-600 rounded-lg px-5 py-2 hover:bg-red-700 font-medium"
        >
          {isPendingDelete ? 'Deleting...' : 'Delete'}
        </button>
      </DialogActions>
    </Dialog>
  );

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
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Field.Text
                      name={`artworkList[${index}].artwork`}
                      disabled={item?.isBackend}
                      label="Artwork Name"
                      placeholder="Search by ArtworkId, Title or Artist Name"
                      value={getValue(index)}
                      onChange={(e) =>
                        setSearch({ search: e.target.value, index: index, code: '' })
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        ...(methods.watch(`artworkList[${index}].artworkId`) && {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Avatar
                                sx={{ width: 30, height: 30 }}
                                alt={methods.getValues(`artworkList[${index}].artwork`)}
                                src={methods.getValues(`artworkList[${index}].artworkImg`)}
                              />
                            </InputAdornment>
                          ),
                        }),
                        endAdornment: (
                          <InputAdornment position="end">
                            {item.isBackend ? null : (
                              <Box
                                onClick={() => removeText(index)}
                                component="span"
                                sx={{
                                  color: 'text.disabled',
                                  fontSize: '0.85rem',
                                  cursor: 'pointer',
                                }}
                              >
                                X
                              </Box>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {item.isBackend ? (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Iconify icon="mdi:delete" />}
                        onClick={() => {
                          setSelectedArtwork(item);
                          setOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Iconify icon="mdi:delete" />}
                        onClick={() => handleRemove(index)}
                      >
                        Remove
                      </Button>
                    )}
                    <ConfirmDialog
                      open={confirm.value}
                      onClose={confirm.onFalse}
                      title={`Delete Artwork - ${item.artwork}`}
                      content={`Are you sure want to delete this artwork from collection - "${data?.collectionName}"`}
                      action={
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteArtwork(item)}
                        >
                          {isPendingDelete ? 'Deleting...' : 'Delete'}
                        </Button>
                      }
                    />
                  </Box>
                  {search.index === index && search.search && (
                    <div className="absolute top-16 w-[100%] rounded-lg z-10 h-[30vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto ">
                      <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {isLoadingArtwork ? (
                          <TableCell>
                            <CircularProgress size={30} />
                          </TableCell>
                        ) : artworkData && artworkData?.length > 0 ? (
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
                                <Avatar alt={i?.artworkName} src={`${imgUrl}/users/${i?.media}`} />

                                <ListItemText
                                  disableTypography
                                  primary={
                                    <Typography variant="body2" noWrap>
                                      {i?.artworkName} {`(${i?.artworkId})`}
                                    </Typography>
                                  }
                                  secondary={
                                    <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                                      {name(i)}
                                    </Link>
                                  }
                                />
                              </Stack>
                            </TableCell>
                          ))
                        ) : (
                          <TableCell>No Artwork Found</TableCell>
                        )}
                      </TableRow>
                    </div>
                  )}
                </div>
                <Field.Text
                  name={`artworkList[${index}].artistName`}
                  label="Artist Name"
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
                <Field.Text
                  sx={{ mb: fields.length > 1 ? 2 : 0 }}
                  required
                  name={`artworkList[${index}].artworkDesc`}
                  label="Artwork Description"
                  multiline
                  rows={4}
                />
              </Box>
            </Stack>
          ))}
          {errors.artworkList?.length === 0 && (
            <Alert severity="error">{errors.artworkList.message}</Alert>
          )}
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
        <Field.Text required name="createdBy" label="Created By" />
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
                          ? `${imgUrl}/videos/${file}`
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
                        ? `${imgUrl}/users/${file}`
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
        <Field.Autocomplete
          required
          name="collectionTags"
          label="Collection Tags"
          placeholder="+ Collection Tags"
          multiple
          freeSolo
          disableCloseOnSelect
          options={[]}
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
  );

  const exclusive = (
    <Card>
      <CardHeader title="Status" sx={{ mb: 1 }} />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-2">
              {renderDetails}
              {/* Save and Cancel for md and larger screens */}
              <div className="flex-row justify-end gap-3 mt-8 hidden md:flex">
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
              {/* Save and Cancel for below md screens */}
              <div className="flex flex-row justify-end gap-3 mt-8 md:hidden">
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
          </div>
        </Stack>
      </Form>

      {handleDeleteOption}
    </div>
  );
}
