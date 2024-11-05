import { Card, Table, TableBody } from '@mui/material';
import { useState, useEffect } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { getToken } from 'src/utils/tokenHelper';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';
import { CategoryTableRow } from './Category-table-row';
import { useQuery } from '@tanstack/react-query';
import { useGetStyleListMutation } from './http/useGetStyleListMutation';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const TABLE_HEAD = [
  { _id: 'name', label: 'Artwork Style Name', width: 150 },
  { _id: 'spanishName', label: 'Spanish Name', width: 150 },
  { _id: 'disciplineName', label: 'Discipline Name', width: 220 },
  { _id: 'createdAt', label: 'Created At', width: 100 },
  { _id: 'actions', label: 'Actions', width: 88 },
];

export function StyleListCategory() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);

  const { data, isLoading } = useGetStyleListMutation();

  useEffect(() => {
    if (data) {
      if (data.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }
    }
  }, [data]);

  return (
    <div>
      <CustomBreadcrumbs
        heading="All Artwork Styles"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'All Artwork Styles' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
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
                rowCount={data.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    data.map((row) => row._id)
                  )
                }
              />
              <TableBody>
                {data.map((row) => (
                  <CategoryTableRow
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
                />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Card>
      )}
    </div>
  );
}
