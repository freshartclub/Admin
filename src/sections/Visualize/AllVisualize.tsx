import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
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
  useTable,
} from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { InputAdornment, TextField } from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { useGetAllVisualize } from './http/useGetAllVisualize';
import { VisualizeTableRow } from './table-row-visualize';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'group', label: 'Group' },
  { id: 'dimension_height', label: 'Dimension Height' },
  { id: 'dimension_weight', label: 'Dimension Weight' },
  { id: 'tags', label: 'Tags' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'actions', label: 'Action' },
];

// ----------------------------------------------------------------------

export function AllVisualize() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [group, setGroup] = useState<string>('All');
  const debounceSearch = useDebounce(search, 800);

  const { data, isLoading } = useGetAllVisualize(debounceSearch, group);

  useEffect(() => {
    if (data) {
      setList(data);
      setNotFound(data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: list,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
      <CustomBreadcrumbs
        heading="Visualize List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Visualize List' }]}
        action={
          <RouterLink href={`${paths.dashboard.visualize.add}`}>
            <span className="bg-black justify-center text-white rounded-md flex items-center px-2 py-3 gap-2">
              <Iconify icon="mingcute:add-line" /> Add Visualize
            </span>
          </RouterLink>
        }
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        sx={{ marginBottom: 2 }}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search By Name or Tags..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

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
                  .map((row, i) => (
                    <VisualizeTableRow key={i} row={row} />
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
