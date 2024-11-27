import type { IInvoice } from 'src/types/invoice';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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
import { useGetAllCollectionList } from '../http/useGetAllCollection';
import { CollectionTableRow } from './collection-table-row';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'collectionName', label: 'Colletion Name', width: 140 },
  { id: 'createdBy', label: 'Created By', width: 140 },
  { id: 'artworkTags', label: 'Artwork Tags', width: 200 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'createdAt', label: 'Created At', width: 140 },
  { id: 'actions', label: 'Actions', wdith: 80 },
];

// ----------------------------------------------------------------------

export function CollectionListView() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [_collectionList, setCollectionList] = useState<IInvoice[]>([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 1000);

  const { data, isLoading } = useGetAllCollectionList(debounceSearch);

  useEffect(() => {
    if (data?.data) {
      setCollectionList(data.data);
      setNotFound(data?.data?.length === 0);
    }
  }, [data?.data]);

  const dataFiltered = applyFilter({
    inputData: _collectionList,
    comparator: getComparator(table.order, table.orderBy),
  });

  const handleDeleteRow = (id: string) => {};
  const handleEditRow = (id: string) => {};
  const handleViewRow = (id: string) => {};

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Collection List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Collection List' }]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <Stack direction="row" marginBottom={2} alignItems={'center'} spacing={2}>
          <TextField
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search By Collection Name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          <RouterLink href={`${paths.dashboard.artwork.collection_management.add}`}>
            <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[11rem]">
              <Iconify icon="mingcute:add-line" /> Add Collection
            </span>
          </RouterLink>
        </Stack>

        {isLoading ? (
          <LoadingScreen />
        ) : (
          <Card>
            <Box sx={{ position: 'relative' }}>
              {/* <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) => {
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              );
            }}
            action={
              <Stack direction="row">
                <Tooltip title="Sent">
                  <IconButton color="primary">
                    <Iconify icon="iconamoon:send-fill" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download">
                  <IconButton color="primary">
                    <Iconify icon="eva:download-outline" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Print">
                  <IconButton color="primary">
                    <Iconify icon="solar:printer-minimalistic-bold" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              </Stack>
            }
          /> */}

              <Scrollbar sx={{ minHeight: 444 }}>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row, i) => (
                        <CollectionTableRow
                          key={i}
                          row={row}
                          url={data?.url}
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
      </DashboardContent>
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
