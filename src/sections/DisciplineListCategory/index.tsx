import { Card, Table, TableBody } from '@mui/material';
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
} from 'src/components/table';
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

import { DisciplineTableRow } from './Discipline-table-row';
import { useQuery } from '@tanstack/react-query';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

const TABLE_HEAD = [
  { _id: 'disciplineName', label: 'Discipline Name', width: 150 },
  { _id: 'disciplineSpanishName', label: 'Spanish Name', width: 150 },
  { _id: 'disciplineDescription', label: 'Description', width: 200 },
  { _id: 'createdAt', label: 'Created At', width: 150 },
  { _id: 'actions', label: 'Actions', width: 88 },
];

export function DiscipleListCategory() {
  const token = getToken();
  const table = useTable();
  const [notFound, setNotFound] = useState(false);

  const fetchData = async () => {
    const response = await axiosInstance.get(`${BASE_URL}/api/admin/list-discipline`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

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

  const dataFiltered = data.data;
  return (
    <div>
      <CustomBreadcrumbs
        heading="All Discipline"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'All Discipline' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />
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
              {dataFiltered.map((row, i) => (
                <DisciplineTableRow
                  key={i}
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
      </Card>
    </div>
  );
}
