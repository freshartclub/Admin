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
import { imgUrl } from 'src/utils/BaseUrls';
import axiosInstance from 'src/utils/axios';
import { AllArtistList } from '../allArtist-table-row';
import { useGetArtistList } from '../http/useGetArtistList';

const TABLE_HEAD = [
  { id: 'artistName', label: 'Artist Name​', width: 200 },
  { id: 'city', label: 'City', width: 130 },
  { id: 'state', label: 'Province', width: 130 },
  { id: 'country', label: 'Country', width: 130 },
  { id: 'nextRevalidationDate', label: 'Revalidation', minWidth: 150, align: 'center' },
  { id: 'isActivated', label: 'Status', width: 130 },
  { id: 'createdAt', label: 'Created At', width: 130 },
  { id: 'action', label: 'Action', width: 88 },
];

export function AllArtist() {
  const table = useTable();

  const [date, setDate] = useState('All');
  const [profile, setProfile] = useState('All');
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [options, setOptions] = useState({
    cursor: '',
    direction: '',
    limit: 10,
    currPage: 1,
  });

  const [_userList, setUserList] = useState([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 800);

  const { data, isLoading } = useGetArtistList(
    debounceSearch,
    date,
    profile,
    options.currPage,
    options.cursor,
    options.direction,
    options.limit
  );

  useEffect(() => {
    if (data) {
      setUserList(data.data || []);
      setNextCursor(data.nextCursor || '');
      setPrevCursor(data.prevCursor || '');
      setNotFound(data.data?.length === 0);
    }
  }, [data]);

  const downloadArtistExcel = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `${ARTIST_ENDPOINTS.downloadAllArtist}?s=${search}&date=${date}&status=${profile}`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'All_Artist_List.xlsx');
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: _userList,
    comparator: getComparator(table.order, table.orderBy),
  });

  const profileStatus = [
    { value: 'All', label: 'All' },
    { value: 'under-review', label: 'Under Review' },
  ];

  const dropDown = [
    { value: 'All', label: 'All' },
    { value: 1, label: 'Less than 1 Week' },
    { value: 2, label: 'Btw 1 and 2 Week' },
    { value: 3, label: 'More than 2 Week' },
  ];

  return (
    <>
      <CustomBreadcrumbs
        heading="All Artist List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'All Artist List', href: paths.dashboard.artist.allArtist },
        ]}
        sx={{ mb: 3 }}
        action={
          <div className="bread-links flex gap-2 items-center">
            <RouterLink href={`${paths.dashboard.artist.createArtist}`}>
              <span className="bg-black text-white rounded-md justify-center flex items-center px-2 py-3 gap-2 md:w-[9rem]">
                <Iconify icon="mingcute:add-line" /> Create Artist
              </span>
            </RouterLink>
            <span
              onClick={() => downloadArtistExcel()}
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
          placeholder="Search By Artist Id, Name or Email..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ flexShrink: 1, width: { xs: 1, md: 280 } }}>
          <InputLabel htmlFor="Profile Status">Profile Status</InputLabel>

          <Select
            input={<OutlinedInput label="Profile Status" />}
            inputProps={{ id: 'Profile Status' }}
            onChange={(e) => setProfile(e.target.value)}
            value={profile}
          >
            {profileStatus.map((option, i) => (
              <MenuItem key={i} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 1, width: { xs: 1, md: 280 } }}>
          <InputLabel htmlFor="Outdated Revalidation Date">Outdated Revalidation Date</InputLabel>

          <Select
            input={<OutlinedInput label="Outdated Revalidation Date" />}
            inputProps={{ id: 'Outdated Revalidation Date' }}
            onChange={(e) => setDate(e.target.value)}
            value={date}
          >
            {dropDown.map((option, i) => (
              <MenuItem key={i} value={option.value}>
                {option.label}
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
                {dataFiltered.map((row) => (
                  <AllArtistList key={row._id} row={row} url={imgUrl} />
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
