import { Card, Table, TableBody } from '@mui/material';
import { useState, useEffect } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import axiosInstance from 'src/utils/axios';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
import { ListArtist } from './artistlist-table-row';
import { useQuery } from '@tanstack/react-query';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';

const TABLE_HEAD = [
  { id: 'name', label: 'Artist Name​' },
  { id: 'id', label: 'Artist Id', width: 180 },
  { id: 'group', label: 'Contact', width: 180 },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'create', label: 'Created At', width: 130 },
  { id: 'action', label: 'Action', width: 88 },
];
export function ListArtists() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);

  // dont forget to change uri
  async function fetchData() {
    const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllArtist}`);
    return data.data;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['styleData'],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5,
  });

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
    <div>
      {/* <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Artist List', href: paths.dashboard },
          //   { name: currentUser?.name },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.artist.addArtist}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create New Artist
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      /> */}
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
                  <ListArtist
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
    </div>
  );
}
