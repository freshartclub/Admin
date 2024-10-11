import { Button, Card, Table, TableBody } from '@mui/material';
import { useState, useEffect } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import axiosInstance from 'src/utils/axios';
import { getToken } from 'src/utils/tokenHelper';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

// import { credentialTable } from "./Discipline-table-row";

import { ArtistsList } from './artistlist-table-row';
import { useQuery } from '@tanstack/react-query';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';
import { ArtistRequest } from '../artistRequest-table-row';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { SuspendedArtistList } from '../suspendedArtistLis-table-row';

const TABLE_HEAD = [
  { id: 'name', label: 'Artist Name​' },

  { id: 'group', label: 'Contact', width: 180 },
   { id: 'city', label: 'City', width: 130 },
   { id: 'country', label: 'Country', width: 130 },

  // { id: 'status', label: 'Status', width: 130 },
  { id: 'create', label: 'Status', width: 220 },
  { id: '', label: 'Action', width: 88 },
];
export function SuspendedArtist() {
  const token = getToken();
  const [styles, setStyles] = useState([]);
  // const [table, setTable] = useTable(); // Initialize table state
  const table = useTable();
  const [notFound, setNotFound] = useState(false);


// dont forget to change uri
  async function fetchData() {
    const { data } = await axiosInstance.get(
   `${ARTIST_ENDPOINTS.suspendedArtist}`
    );
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
          { name: 'Suspended Artist', href: paths.dashboard },
          //   { name: currentUser?.name },
        ]}
       
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
    </div>
  );
}
