import type { IInvoice } from 'src/types/user';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { saveAs } from 'file-saver';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { ArtworkTableRow } from './Artwork-table-row';
import { useGetArtworkList } from './http/useGetArtworkList';
import { ADMIN_BASE_URL, ARTIST_BASE_URL, imgUrl } from 'src/utils/BaseUrls';
import axiosInstance from 'src/utils/axios';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'artworkName', label: 'Artwork Name', width: 180 },
  { id: 'artistName', label: 'Artist Name', width: 150 },
  { id: 'discipline', label: 'Discipline', width: 100 },
  { id: 'activeTab', label: 'Commercialization ', width: 100 },
  { id: 'createdAt', label: 'Created At', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'action', label: 'Action', width: 100 },
];

// ----------------------------------------------------------------------

export function ArtworkListView() {
  const table = useTable();
  const [sStatus, setStatus] = useState<string>('All');
  const [days, setDays] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 1000);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_artworkList, setArtworkList] = useState<IInvoice[]>([]);

  const { data, isLoading } = useGetArtworkList(debounceSearch, sStatus, days);

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
      setArtworkList(data);
      setNotFound(data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _artworkList,
    comparator: getComparator(table.order, table.orderBy),
  });

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

  return (
    <>
      <CustomBreadcrumbs
        heading="Artwork List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Artwork List' }]}
        sx={{ mb: 3 }}
        action={
          <div className="flex justify-end gap-2">
            <RouterLink href={paths.dashboard.artwork.addArtwork}>
              <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[9rem]">
                <Iconify icon="mingcute:add-line" /> Add Artwork
              </span>
            </RouterLink>
            <RouterLink href={`#`}>
              <span
                onClick={() => downloadArtworkExcel()}
                className="bg-green-600 text-white rounded-md flex items-center px-2 py-3 gap-1"
              >
                <Iconify icon="mingcute:add-line" /> {loading ? 'Downloading...' : 'Export CSV'}
              </span>
            </RouterLink>
          </div>
        }
      />
      <Stack direction="row" marginBottom={2} alignItems={'center'} spacing={2}>
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
      </Stack>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Card>
          <Box sx={{ position: 'relative' }}>
            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
                    .map((row, i) => (
                      <ArtworkTableRow key={i} row={row} url={imgUrl} />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

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

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IInvoice[];
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
