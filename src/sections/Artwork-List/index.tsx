import {
  Box,
  Card,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TextField,
  Typography,
} from '@mui/material';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import { getComparator, TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { RouterLink } from 'src/routes/components';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';
import { imgUrl } from 'src/utils/BaseUrls';
import { ArtworkTableRow } from './Artwork-table-row';
import { useGetArtworkList } from './http/useGetArtworkList';

const TABLE_HEAD = [
  { id: 'artworkName', label: 'Artwork Name', width: 180 },
  { id: 'artistName', label: 'Artist Name', width: 150 },
  { id: 'discipline', label: 'Discipline', width: 100 },
  { id: 'activeTab', label: 'Commercialization', width: 100 },
  { id: 'createdAt', label: 'Created At', width: 100 },
  { id: 'comingSoon', label: 'Coming Soon', minWidth: 120 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'action', label: 'Action', width: 100 },
];

export function ArtworkListView() {
  const [artworks, setArtworks] = useState([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    cursor: '',
    direction: '',
    limit: 10,
    currPage: 1,
  });
  const [search, setSearch] = useState('');
  const [notFound, setNotFound] = useState(false);

  const table = useTable();
  const [sStatus, setStatus] = useState<string>('All');
  const [days, setDays] = useState<string>('All');
  const debounceSearch = useDebounce(search, 800);

  const { data, isLoading } = useGetArtworkList(
    debounceSearch,
    sStatus,
    days,
    options.currPage,
    options.cursor,
    options.direction,
    options.limit
  );

  const weeks = ['All', '1 Day', '1 Week', '1 Month', '1 Quarter', '1 Year'];
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'modified', label: 'Modified' },
  ];

  useEffect(() => {
    if (data) {
      setArtworks(data.data || []);
      setNextCursor(data.nextCursor || '');
      setPrevCursor(data.prevCursor || '');
      setNotFound(data.data?.length === 0);
    }
  }, [data]);

  const downloadArtworkExcel = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `${ARTIST_ENDPOINTS.downloadArtwork}?s=${search}&status=${sStatus}&days=${days}`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Artwork_List.xlsx');
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: artworks,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
      <CustomBreadcrumbs
        heading="Artwork List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Artwork List' }]}
        sx={{ mb: 3 }}
        action={
          <div className="bread-links flex justify-end gap-2">
            <RouterLink href={paths.dashboard.artwork.addArtwork}>
              <span className="bg-black text-white rounded-md flex justify-center items-center px-2 py-3 gap-2 md:w-[9rem]">
                <Iconify icon="mingcute:add-line" /> Add Artwork
              </span>
            </RouterLink>
            <span
              onClick={() => downloadArtworkExcel()}
              className={`${loading ? 'cursor-not-allowed opacity-50' : ''} cursor-pointer bg-green-600 justify-center text-white rounded-md flex items-center px-2 py-3 gap-1`}
            >
              {loading ? (
                'Downloading...'
              ) : (
                <>
                  <Iconify icon="mingcute:add-line" /> Export CSV
                </>
              )}
            </span>
          </div>
        }
      />
      <Stack
        direction={{ xs: 'column', md: 'row', lg: 'row' }}
        marginBottom={2}
        alignItems={'center'}
        spacing={2}
      >
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Artwork Id/Name or Artist Id/Name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="Status">Status</InputLabel>

          <Select
            input={<OutlinedInput label="Status" />}
            inputProps={{ id: 'Status' }}
            onChange={(e) => setStatus(e.target.value)}
            value={sStatus}
            sx={{ textTransform: 'capitalize' }}
          >
            <MenuItem value="All">All</MenuItem>
            {statusOptions && statusOptions.length > 0 ? (
              statusOptions.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="All">No Data</MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="Creation Time Frame">Creation Time Frame</InputLabel>

          <Select
            input={<OutlinedInput label="Creation Time Frame" />}
            inputProps={{ id: 'Creation Time Frame' }}
            sx={{ textTransform: 'capitalize' }}
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            {weeks.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Card>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />
              <TableBody>
                {dataFiltered.map((artwork, i) => (
                  <ArtworkTableRow key={i} url={imgUrl} row={artwork} />
                ))}
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>

          <Stack direction="row" justifyContent="space-between">
            <FormControlLabel
              className="dense-table"
              sx={{ pl: 2 }}
              label="Dense"
              control={<Switch name="dense" checked={table.dense} onChange={table.onChangeDense} />}
            />
            <Box className="row-table" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="body2">Rows per page:</Typography>

                <Select
                  onChange={(e) =>
                    setOptions({ ...options, cursor: '', currPage: 1, limit: e.target.value })
                  }
                  value={options.limit}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                >
                  {[5, 10, 25].map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {`${(options.currPage - 1) * options.limit + 1} - ${Math.min(options.currPage * options.limit, data?.totalCount)} of ${data?.totalCount}`}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    disabled={!prevCursor || isLoading}
                    sx={{
                      bgcolor: 'default.light',
                      color: `${prevCursor ? 'black' : 'text.disabled'}`,
                      width: 32,
                      height: 32,
                    }}
                    onClick={() => {
                      setOptions({
                        ...options,
                        cursor: prevCursor,
                        direction: 'prev',
                        currPage: options.currPage === 1 ? 1 : options.currPage - 1,
                      });
                    }}
                  >
                    <Iconify icon="weui:back-filled" />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: 'default.light',
                      color: `${nextCursor ? 'black' : 'text.disabled'}`,
                      width: 32,
                      height: 32,
                    }}
                    onClick={() => {
                      setOptions({
                        ...options,
                        cursor: nextCursor,
                        direction: 'next',
                        currPage: options.currPage + 1,
                      });
                    }}
                    disabled={!nextCursor || isLoading}
                  >
                    <Iconify sx={{ transform: 'rotate(180deg)' }} icon="weui:back-filled" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Card>
      )}
    </>
  );
}

type ApplyFilterProps = {
  inputData: any[];
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
