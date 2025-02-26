import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  ListItemText,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { imgUrl } from 'src/utils/BaseUrls';
import { z as zod } from 'zod';
import useAddCircle from './http/useAddCircle';
import { useGetCircleById } from './http/useGetCircleById';
import { useGetUserOnSearch } from './http/useGetUserOnSearch';
import { useGetMemeberList } from './http/useGetMemberList';
import { fDate } from 'src/utils/format-time';

type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  foradmin: zod.boolean(),
  content: schemaHelper.editor({ message: { required_error: 'Content is required!' } }),
  backImage: schemaHelper.file({ message: { required_error: 'Cover Image is required!' } }),
  mainImage: schemaHelper.file({ message: { required_error: 'Main Image is required!' } }),
  categories: zod.string().array().min(2, { message: 'Must have at least 2 Categories!' }),
  type: zod.string().min(1, { message: 'Visibility is Required' }),
  managers: zod.string().array().optional(),
  managerInfo: zod.any(),
  status: zod.string().min(1, { message: 'Status is required!' }),
});

const AddCircle = () => {
  const navigate = useNavigate();
  const id = useSearchParams().get('id');
  const [search, setSearch] = useState('');

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const { data, isLoading } = useGetCircleById(id);
  const { data: memberData, isLoading: memberLoading } = useGetMemeberList(id);

  console.log(memberData);

  const defaultValues = useMemo(
    () => ({
      title: data?.title || '',
      description: data?.description || '',
      content: data?.content || '',
      foradmin: data?.foradmin || false,
      backImage: data?.coverImage || null,
      mainImage: data?.mainImage || null,
      type: data?.type || 'Public',
      categories: data?.categories || [],
      managers: data?.managers || [],
      managerInfo: data?.managers || [],
      status: data?.status || '',
    }),
    [data]
  );
  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const debounceArtistId = useDebounce(search, 800);
  const { data: artistData, isLoading: artistLoading } = useGetUserOnSearch(debounceArtistId);

  const { reset, watch, handleSubmit } = methods;
  const values = watch();

  useEffect(() => {
    if (data) {
      const updatedData = {
        ...data,
        mainImage: `${imgUrl}/users/${data?.mainImage}`,
        backImage: `${imgUrl}/users/${data?.coverImage}`,
        managers: data.managers ? data.managers.map((item) => item._id) : [],
        managerInfo: data.managers
          ? data?.managers?.map((item) => {
              return {
                _id: item?._id,
                userId: item?.userId,
                name: name(item),
                img: `${imgUrl}/users/${item?.img}`,
              };
            })
          : [],
      };
      reset(updatedData);
    }
  }, [data]);

  const { mutate, isPending } = useAddCircle(id);

  const handleBackRemoveFile = () => {
    methods.setValue('backImage', null);
  };

  const handleMainRemoveFile = () => {
    methods.setValue('mainImage', null);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      if (!data.mainImage) {
        toast.error('Main Image is required');
        return;
      }

      if (data.foradmin == false) {
        if (data.managers.length == 0) {
          return toast.error('Managers is required');
        }
      }

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('foradmin', data.foradmin);
      formData.append('content', data.content);
      formData.append('type', data.type);
      formData.append('backImage', data.backImage);
      formData.append('mainImage', data.mainImage);
      formData.append('categories', JSON.stringify(data.categories));
      formData.append('managers', JSON.stringify(data.managers));
      formData.append('status', data.status);

      mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

  const statusOptions = ['Draft', 'Published'];
  const foradminOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const renderDetails = (
    <Card>
      <CardHeader title="Circle Details" sx={{ mb: 2 }} />
      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title" required label="Circle Title" />
        <Field.SingelSelect name="foradmin" label="For Admin" required options={foradminOptions} />
        <Field.SingelSelect
          name="type"
          label="Visiblity"
          required
          options={['Private', 'Public'].map((item, i) => ({ value: item, label: item }))}
        />
        <Field.Text name="description" required label="Circle Description" multiline rows={3} />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Content</Typography>
          <Field.Editor name="content" required sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Main Image</Typography>
          <Field.Upload name="mainImage" maxSize={3145728} onDelete={handleMainRemoveFile} />
        </Stack>

        <Field.Autocomplete
          name="categories"
          label="Categories *"
          placeholder="+ Categories"
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
        {methods.watch('foradmin') === false ? (
          <>
            <div className="relative">
              <Field.Text
                name="artistSearch"
                label="Add artist/users to this circle"
                placeholder="Search by User ID/Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <div className="absolute top-16 w-[100%] rounded-lg z-10 h-[40vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto">
                  <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {artistLoading ? (
                      <TableCell>
                        <CircularProgress size={30} />
                      </TableCell>
                    ) : artistData && artistData?.length > 0 ? (
                      artistData.map((i, j) => (
                        <TableCell
                          className={`${methods.getValues('managers').includes(i?._id) && 'bg-zinc-300'}`}
                          onClick={() => {
                            const getManagers = methods.getValues('managers');
                            const getManagersInfo = methods.getValues('managerInfo');

                            if (getManagers?.includes(i?._id)) {
                              methods.setValue(
                                'managers',
                                getManagers.filter((id) => id !== i?._id)
                              );
                              methods.setValue(
                                'managerInfo',
                                getManagersInfo.filter((a) => a?._id !== i?._id)
                              );
                            } else {
                              methods.setValue('managers', [...getManagers, i?._id]);
                              methods.setValue('managerInfo', [
                                ...getManagersInfo,
                                {
                                  _id: i?._id,
                                  userId: i?.userId,
                                  name: name(i),
                                  img: `${imgUrl}/users/${i?.mainImage}`,
                                },
                              ]);
                            }
                            setSearch('');
                          }}
                          key={j}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <Stack spacing={2} direction="row" alignItems="center">
                            <Avatar alt={i?.artistName} src={`${imgUrl}/users/${i?.mainImage}`} />

                            <ListItemText
                              disableTypography
                              primary={
                                <Typography variant="body2" noWrap>
                                  {name(i)} - {i?.userId}
                                </Typography>
                              }
                              secondary={<Link sx={{ color: 'text.disabled' }}>{i?.email}</Link>}
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
            <Field.Autocomplete
              name="managerInfo"
              label="Managers"
              placeholder="Managers"
              multiple
              options={[]}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <div
                    className="flex items-center gap-2 bg-slate-200 py-1 px-2 pl-[4px] rounded-full"
                    key={option?._id}
                  >
                    <Avatar sx={{ width: 24, height: 24 }} alt={option?._id} src={option?.img} />
                    <Stack sx={{ fontSize: '12px', gap: 2 }}>
                      <Link color="inherit" sx={{ cursor: 'pointer', lineHeight: 0 }}>
                        {option?.name}
                      </Link>
                      <Box component="span" sx={{ color: 'text.disabled', lineHeight: 0 }}>
                        {option?.userId}
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const getManagers = methods.getValues('managers');
                        const getManagersInfo = methods.getValues('managerInfo');
                        methods.setValue(
                          'managers',
                          getManagers.filter((id) => id !== option?._id)
                        );
                        methods.setValue(
                          'managerInfo',
                          getManagersInfo.filter((a) => a?._id !== option?._id)
                        );
                      }}
                    >
                      <Iconify icon="eva:close-fill" />
                    </IconButton>
                  </div>
                ))
              }
            />
          </>
        ) : null}

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Cover Image</Typography>
          <Field.Upload name="backImage" maxSize={3145728} onDelete={handleBackRemoveFile} />
        </Stack>

        <Field.SingelSelect
          name="status"
          label="Status"
          options={statusOptions.map((i) => {
            return { value: i, label: i };
          })}
        />
        {id ? (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Member List ({memberData?.length})</Typography>
            <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {memberLoading ? (
                <TableCell>
                  <CircularProgress size={30} />
                </TableCell>
              ) : memberData && memberData?.length > 0 ? (
                memberData.map((i, j) => (
                  <TableCell
                    key={j}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Avatar alt={i?.artistName} src={`${imgUrl}/users/${i?.user?.img}`} />

                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="body2" noWrap>
                            {name(i?.user)} - {i?.user?.userId}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                              {i?.user?.email}
                            </Link>
                          </>
                        }
                      />
                      <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
                        Followed On - {fDate(i?.createdAt)}
                      </Link>
                    </Stack>
                  </TableCell>
                ))
              ) : (
                <TableCell>No Members Available</TableCell>
              )}
            </TableRow>
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );

  if (id && isLoading) return <LoadingScreen />;

  return (
    <>
      <CustomBreadcrumbs
        heading="Add Circle"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add Circle' }]}
        sx={{ mb: 2 }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          {renderDetails}
          <div className="flex justify-end gap-2">
            <span
              onClick={() => navigate(paths.dashboard.category.discipline.list)}
              className="px-3 py-2 text-black border rounded-md cursor-pointer"
            >
              Cancel
            </span>
            <button
              disabled={isPending}
              type="submit"
              className="px-3 py-2 text-white bg-black rounded-md"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Stack>
      </Form>
    </>
  );
};

export default AddCircle;
