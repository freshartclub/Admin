import type { IUserItem } from 'src/types/user';

import { Card, MenuItem, OutlinedInput, Select, Stack, Table, TableBody } from '@mui/material';
import { useEffect, useState } from 'react';
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
import { ArtistRequest } from '../artistRequest-table-row';
import { useGetAllArtistRequest } from '../http/useGetAllArtistRequset';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';
import { InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';

const TABLE_HEAD = [
  { id: 'artistName', label: 'Artist Name​', width: 180 },
  { id: 'phone', label: 'Contact', width: 140 },
  { id: 'city', label: 'City', width: 140 },
  { id: 'country', label: 'Country', width: 80 },
  { id: 'isArtistRequestStatus', label: 'Request Status', width: 140 },
  { id: 'cv', label: 'CV', width: 60 },
  { id: 'buttons', label: 'Button', width: 80 },
  { id: 'action', label: 'Action', width: 40 },
];

export function ArtistsRequest() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [sStatus, setStatus] = useState('All');
  const [_userList, setUserList] = useState<IUserItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 1000);

  const { data, isLoading } = useGetAllArtistRequest(debounceSearch, sStatus);

  useEffect(() => {
    if (data?.data) {
      setUserList(data?.data);
      setNotFound(data?.data.length === 0);
    }
  }, [data?.data]);

  const dataFiltered = applyFilter({
    inputData: _userList,
    comparator: getComparator(table.order, table.orderBy),
  });

  const handleDeleteRow = (id: string) => {};
  const handleEditRow = (id: string) => {};

  return (
    <>
      <Stack direction="row" marginBottom={2} alignItems={'center'} spacing={2}>
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Name/Email..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ flexShrink: 1, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="Status">Status</InputLabel>

          <Select
            input={<OutlinedInput label="Status" />}
            inputProps={{ id: 'Status' }}
            onChange={(e) => setStatus(e.target.value)}
            value={sStatus}
          >
            {['All', 'Pending', 'Ban', 'Rejected', 'Under-Review'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <RouterLink href={`${paths.dashboard.artist.createArtist}`}>
          <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[9rem]">
            <Iconify icon="mingcute:add-line" /> Create Artist
          </span>
        </RouterLink>
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
                    <ArtistRequest
                      key={row._id}
                      row={row}
                      url={data?.url}
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
