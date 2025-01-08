import type { IUserItem } from 'src/types/user';

import {
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Table,
  TableBody,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { AllArtistList } from '../allArtist-table-row';
import { useGetArtistList } from '../http/useGetArtistList';
import { imgUrl } from 'src/utils/BaseUrls';
import axiosInstance from 'src/utils/axios';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { saveAs } from 'file-saver';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { RouterLink } from 'src/routes/components';

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
  const navigate = useNavigate();
  const [date, setDate] = useState('All');
  const [profile, setProfile] = useState('All');
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const [_userList, setUserList] = useState<IUserItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 1000);

  const { data, isLoading } = useGetArtistList(debounceSearch, date, profile);

  useEffect(() => {
    if (data) {
      setUserList(data);
      setNotFound(data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _userList,
    comparator: getComparator(table.order, table.orderBy),
  });

  const handleDeleteRow = (id: string) => {};
  const handleEditRow = (id: string) => {
    navigate(`${paths.dashboard.artist.addArtist}?id=${id}`);
  };

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

  const profileStatus = [
    {
      value: 'All',
      label: 'All',
    },
    {
      value: 'under-review',
      label: 'Under Review',
    },
  ];

  const dropDown = [
    {
      value: 'All',
      label: 'All',
    },
    {
      value: 1,
      label: '1 Week',
    },
    {
      value: 2,
      label: '2 Week',
    },
    {
      value: 3,
      label: '3 Week',
    },
    {
      value: 4,
      label: '4 Week',
    },
  ];

  return (
    <>
      <CustomBreadcrumbs
        heading="All Artist List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'All Artist List​', href: paths.dashboard.artist.allArtist },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
        action={
          <div className="flex gap-2 items-center">
            <RouterLink href={`${paths.dashboard.artist.createArtist}`}>
              <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[9rem]">
                <Iconify icon="mingcute:add-line" /> Create Artist
              </span>
            </RouterLink>
            <span
              onClick={() => downloadArtistExcel()}
              className={`${loading ? 'cursor-not-allowed opacity-50' : ''} cursor-pointer bg-green-600 text-white rounded-md flex items-center px-2 py-3 gap-1`}
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
      <Stack sx={{ mb: 2 }} direction="row" marginBottom={2} alignItems={'center'} spacing={2}>
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
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <AllArtistList
                      key={row._id}
                      row={row}
                      url={imgUrl}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                    />
                  ))}
                <TableEmptyRows
                  height={table.dense ? 56 : 76}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      )}
    </>
  );
}

type ApplyFilterProps = {
  inputData: IUserItem[];
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
