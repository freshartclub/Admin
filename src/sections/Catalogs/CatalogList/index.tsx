import type { IInvoice } from 'src/types/invoice';

import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { InputAdornment, TextField } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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
import { RouterLink } from 'src/routes/components';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { useGetAllCatalogList } from '../http/useGetAllCatalog';
import { CatalogTableRow } from './Catalog-table-row';
import { imgUrl } from 'src/utils/BaseUrls';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'catalogName', label: 'Catalog Name', width: 150 },
  { id: 'artworkList', label: 'Artwork List', width: 220 },
  { id: 'subPlan', label: 'Subscription Plan', width: 150 },
  { id: 'isDeleted', label: 'Status', width: 130 },
  { id: 'createdAt', label: 'Created At', width: 120 },
  { id: 'actions', label: 'Actions', width: 80 },
];

// ----------------------------------------------------------------------

export function CatalogListView() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [_catalogList, setCatalogList] = useState<IInvoice[]>([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 800);

  const { data, isLoading } = useGetAllCatalogList(debounceSearch);

  useEffect(() => {
    if (data) {
      setCatalogList(data);
      setNotFound(data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _catalogList,
    comparator: getComparator(table.order, table.orderBy),
  });

  const handleDeleteRow = (id: string) => {};
  const handleEditRow = (id: string) => {};
  const handleViewRow = (id: string) => {};

  return (
    <>
      <CustomBreadcrumbs
        heading="Catalog List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Catalog List' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Stack direction="row" marginBottom={2} alignItems={'center'} spacing={2}>
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Catalog Name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <RouterLink href={`${paths.dashboard.artwork.catalog.add}`}>
          <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[9rem]">
            <Iconify icon="mingcute:add-line" /> Add Catalog
          </span>
        </RouterLink>
      </Stack>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Card>
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
                  .map((row) => (
                    <CatalogTableRow key={row.id} row={row} url={imgUrl} />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
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
