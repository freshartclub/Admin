import { Card, Table, TableBody } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  useTable,
} from 'src/components/table';
import { paths } from 'src/routes/paths';
import { useGetTechnicMutation } from './http/useGetTechnicMutation';
import { TechnicTableRow } from './Technic-table-row';

const TABLE_HEAD = [
  { id: 'name', label: 'Technic Name', width: 150 },
  { id: 'spanishName', label: 'Spanish Name', width: 150 },
  { id: 'disciplineName', label: 'Discipline', width: 220 },
  { id: 'createdAt', label: 'Created At', width: 100 },
  { id: 'actions', label: 'Actions', width: 88 },
];

export function TechnicListCategory() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);

  const { data, isLoading } = useGetTechnicMutation();

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
        heading="Technic List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Technic List' }]}
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
                  <TechnicTableRow
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
