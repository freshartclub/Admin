import type { IUserItem } from 'src/types/user';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';

import { LoadingScreen } from 'src/components/loading-screen';
import { ArtworkTableRow } from './Artwork-table-row';
import { useGetArtworkList } from './http/useGetArtworkList';
import { TextField } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { useDebounce } from 'src/routes/hooks/use-debounce';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'artworkName', label: 'Artwork Name', width: 180 },
  { id: 'artworkId', label: 'Artwork Id', width: 180 },
  { id: 'artistName', label: 'Artist Name', width: 180 },
  { id: 'isArtProvider', label: 'Art Provider', width: 150 },
  { id: 'discipline', label: 'Discipline', width: 100 },
  { id: 'createdAt', label: 'Created At', width: 100 },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' },
];

// ----------------------------------------------------------------------

export function ArtworkListView() {
  const table = useTable();
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 1000);
  const [notFound, setNotFound] = useState(false);
  const [url, setUrl] = useState('');
  const [_artworkList, setArtworkList] = useState<IUserItem[]>([]);

  const { data, isLoading } = useGetArtworkList(debounceSearch);

  useEffect(() => {
    if (data?.data) {
      setArtworkList(data?.data);
      setUrl(data?.url);
      setNotFound(data?.data?.length === 0);
    }
  }, [data?.data]);

  const dataFiltered = applyFilter({
    inputData: _artworkList,
    comparator: getComparator(table.order, table.orderBy),
  });

  const handleDeleteRow = (id: string) => {};
  const handleEditRow = (id: string) => {};
  const handleViewRow = (id: string) => {};

  return (
    <>
      <CustomBreadcrumbs
        heading="Artwork List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Artwork List' }]}
        sx={{ mb: 3 }}
      />
      <Stack direction="row" marginBottom={2} alignItems={'center'} spacing={2}>
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Artwork Id/Name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <RouterLink href={paths.dashboard.artwork.addArtwork}>
          <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[9rem]">
            <Iconify icon="mingcute:add-line" /> Add Artwork
          </span>
        </RouterLink>
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
                      <ArtworkTableRow
                        key={i}
                        row={row}
                        url={url}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
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
