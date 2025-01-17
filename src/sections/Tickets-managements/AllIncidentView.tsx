import type { IUserItem } from 'src/types/user';

import { Card, Table, TableBody, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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
import { paths } from 'src/routes/paths';
import { AllIncidentList } from './AllIncidentList';
import { useGetAllIncidentMutation } from './http/useGetAllIncidentMutation';
import { InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useDebounce } from 'src/routes/hooks/use-debounce';

const TABLE_HEAD = [
  { id: 'incGroup', label: 'Inc Group' },
  { id: 'incType', label: 'Inc Type' },
  { id: 'title', label: 'Inc Title' },
  { id: 'status', label: 'Status' },
  { id: 'severity', label: 'Severity' },
  { id: 'initTime', label: 'Initial Date' },
  { id: 'endTime', label: 'End Date' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'actions', label: 'Action', width: 88 },
];

export function AllIncidentView() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [_incidentList, setIncidentList] = useState<IUserItem[]>([]);
  const [search, setSearch] = useState('');

  const debounceSearch = useDebounce(search, 800);

  const { data, isLoading } = useGetAllIncidentMutation(debounceSearch);

  useEffect(() => {
    if (data) {
      setIncidentList(data);
      setNotFound(data.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _incidentList,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
      <CustomBreadcrumbs
        heading="All Incident List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Incident List' }]}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search By Incident Title, Group or Type..."
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
                    <AllIncidentList key={row._id} row={row} />
                  ))}
                <TableEmptyRows
                  height={table.dense ? 56 : 76}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>

            <TablePaginationCustom
              page={table.page}
              dense={table.dense}
              count={dataFiltered.length}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onChangeDense={table.onChangeDense}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          </Scrollbar>
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
