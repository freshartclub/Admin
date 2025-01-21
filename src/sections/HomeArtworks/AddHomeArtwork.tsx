import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import {
  Avatar,
  CircularProgress,
  Link,
  ListItemText,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { imgUrl } from 'src/utils/BaseUrls';
import { useGetSearchedArtworks } from '../Collection-Management/http/useGetSearchedArtworks';
import useAddHomeArtwork from './http/useAddHomeArtwork';
import { useGetHomeArtworkById } from './http/useGetHomeArtworkById';
import { IconButton } from '@mui/material';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

const NewProductSchema = zod.object({
  artworksTitle: zod.string().min(1, { message: 'Artwork Section Name is required!' }),
  artworks: zod.any(),
});

// ----------------------------------------------------------------------

export function AddHomeArtwork() {
  const id = useSearchParams().get('id');
  const [search, setSearch] = useState('');

  const navigate = useNavigate();
  const { data, isLoading } = useGetHomeArtworkById(id);

  const defaultValues = useMemo(
    () => ({
      artworksTitle: data?.artworksTitle || '',
      artworks: data?.artworks || [],
    }),
    [data]
  );

  const debounceArtwork = useDebounce(search, 800);
  const { data: artData, isLoading: artLoading } = useGetSearchedArtworks(debounceArtwork);

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;
  const { mutate, isPending } = useAddHomeArtwork(id);

  useEffect(() => {
    if (id && data) {
      reset({
        artworksTitle: data?.artworksTitle || '',
        artworks: data.artworks
          ? data?.artworks?.map((item) => {
              return {
                _id: item?._id,
                artworkId: item?.artworkId,
                artworkName: item?.artworkName,
                img: `${imgUrl}/users/${item?.img}`,
              };
            })
          : [],
      });
    }
  }, [data]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (methods.getValues('artworks').length === 0)
        return toast.error('Select Atleast 1 Artworks');
      mutate(data);
    } catch (error) {
      console.error(error);
    }
  });

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  if (id && isLoading) return <LoadingScreen />;

  const renderDetails = (
    <Card sx={{ mb: 5 }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={4}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
        >
          <Field.Text required name="artworksTitle" label="Artwork Section Title" />
          <div className={`relative ${search ? 'h-[49vh]' : ''}`}>
            <Field.Text
              name="artSearch"
              label="Search Artwork By Artwork ID/Name or Artist Name"
              placeholder="Search Artwork By Artwork ID/Name or Artist Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <section className="absolute top-16 w-[100%] rounded-lg z-10 h-[40vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto">
                <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {artLoading ? (
                    <TableCell>
                      <CircularProgress size={30} />
                    </TableCell>
                  ) : artData && artData?.length > 0 ? (
                    artData.map((i, j) => (
                      <TableCell
                        className={`${
                          methods.getValues('artworks').some((a) => a?._id === i?._id) &&
                          'bg-zinc-300'
                        }`}
                        onClick={() => {
                          const getArtInfo = methods.getValues('artworks');

                          if (getArtInfo.some((a) => a?._id === i?._id)) {
                            methods.setValue(
                              'artworks',
                              getArtInfo.filter((a) => a?._id !== i?._id)
                            );
                          } else {
                            methods.setValue('artworks', [
                              ...getArtInfo,
                              {
                                _id: i?._id,
                                artworkId: i?.artworkId,
                                artworkName: i?.artworkName,
                                img: `${imgUrl}/users/${i?.media}`,
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
                          <Avatar alt={i?.artworkName} src={`${imgUrl}/users/${i?.media}`} />

                          <ListItemText
                            disableTypography
                            primary={
                              <Typography variant="body2" noWrap>
                                {i?.artworkName} - ({i?.artworkId})
                              </Typography>
                            }
                            secondary={<Link sx={{ color: 'text.disabled' }}>{name(i)}</Link>}
                          />
                        </Stack>
                      </TableCell>
                    ))
                  ) : (
                    <TableCell>No Data Available</TableCell>
                  )}
                </TableRow>
              </section>
            )}
          </div>
          <Field.Autocomplete
            name="artworks"
            label="Selected Artworks"
            placeholder="+ Select Artworks"
            freeSolo
            multiple
            disableCloseOnSelect
            options={[]}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, i) => (
                <div
                  className="flex items-center gap-2 bg-slate-200 py-1 px-2 pl-[4px] rounded-full"
                  key={i}
                >
                  <Avatar
                    sx={{ width: 24, height: 24 }}
                    alt={option?.artworkName}
                    src={option?.img}
                  />
                  <Stack sx={{ fontSize: '12px', gap: 2 }}>
                    <Link color="inherit" sx={{ cursor: 'pointer', lineHeight: 0 }}>
                      {option?.artworkName}
                    </Link>
                    <Box component="span" sx={{ color: 'text.disabled', lineHeight: 0 }}>
                      {option?.artworkId}
                    </Box>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const getArtInfo = methods.getValues('artworks');
                      methods.setValue(
                        'artworks',
                        getArtInfo.filter((a) => a?._id !== option?._id)
                      );
                    }}
                  >
                    <Iconify icon="eva:close-fill" />
                  </IconButton>
                </div>
              ))
            }
          />
        </Box>
      </Stack>
    </Card>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading={`${id ? 'Edit' : 'Add'} Home Artwork`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: `${id ? 'Edit' : 'Add'} Home Artwork` },
        ]}
        sx={{ mb: 3 }}
      />
      <Form methods={methods} onSubmit={onSubmit}>
        {renderDetails}
        <Stack spacing={3}>
          <div className="flex justify-end gap-2">
            <span
              onClick={() => navigate(paths.dashboard.artwork.homeArtwork.list)}
              className="px-3 py-2 text-white bg-red-500 rounded-md cursor-pointer"
            >
              Cancel
            </span>

            <button
              disabled={isPending}
              type="submit"
              className="px-3 py-2 text-white bg-black rounded-md cursor-pointer"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Stack>
      </Form>
    </>
  );
}
