import type { IUserItem, IUserTableFilters } from 'src/types/user';

import { useSetState } from 'src/hooks/use-set-state';
import { Card, Table, TableBody } from '@mui/material';
import { useState, useEffect } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import {
  useTable,
  emptyRows,
  rowInPage,
  getComparator,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import { useGetAllIncidentMutation } from './http/useGetAllIncidentMutation';
import { AllIncidentList } from './AllIncidentList';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

const TABLE_HEAD = [
  { id: 'group', label: 'Inc Group', width: 130 },
  { id: 'type', label: 'Inc Type', width: 130 },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'date', label: 'Date & Time', width: 130 },
  { id: 'Initial', label: 'Initial Time', width: 130 },
  { id: 'end', label: 'End Time', width: 130 },
  { id: 'action', label: 'Action', width: 88 },
];

export function AllIncidentView() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [_incidentList, setIncidentList] = useState<IUserItem[]>([]);

  const { data, isLoading, isError, error } = useGetAllIncidentMutation();

  useEffect(() => {
    if (data) {
      setIncidentList(data);
      setNotFound(data.length === 0);
    }
  }, [data]);

  const filters = useSetState<IUserTableFilters>({
    group: '',
    type: '',
    date: '',
    status: 'all',
  });

  const dataFiltered = applyFilter({
    inputData: _incidentList,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const handleDeleteRow = (id: string) => {
    console.log(id);
  };

  const handleEditRow = (id: string) => {
    console.log(id);
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Card>
      <CustomBreadcrumbs
        heading="All Incident List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Incident List', href: paths.dashboard.tickets.allIncident },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Scrollbar>
        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                dataFiltered.map((row) => row._id)
              )
            }
          />
          <TableBody>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <AllIncidentList
                  key={row._id}
                  row={row}
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
  );
}

type ApplyFilterProps = {
  inputData: IUserItem[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, city, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.artistName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (city) {
    inputData = inputData.filter(
      (user) => user?.address?.city.toLowerCase().indexOf(city.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  return inputData;
}
