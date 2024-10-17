import { Card, Table, TableBody } from '@mui/material';
import { useState, useEffect } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
import { SuspendedArtistList } from '../suspendedArtistLis-table-row';
import { useGetSuspendedArtistList } from '../http/useGetSuspendedArtist';

const TABLE_HEAD = [
  { id: 'name', label: 'Artist Name​', width: 130 },
  { id: 'group', label: 'Contact', width: 130 },
  { id: 'city', label: 'City', width: 130 },
  { id: 'country', label: 'Country', width: 130 },
  { id: 'create', label: 'Created At', width: 130 },
  { id: 'action', label: 'Action', width: 88 },
];
export function SuspendedArtist() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);

  const { data, isLoading, isError, error } = useGetSuspendedArtistList();

  useEffect(() => {
    if (data) {
      if (data.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
    }
  }, [data]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <div>An error has occurred: {error.message}</div>;
  }

  const dataFiltered = data;

  return (
    <Card>
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
                <SuspendedArtistList
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
