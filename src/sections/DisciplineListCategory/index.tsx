import { Card, Table, TableBody } from '@mui/material';
import { useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  useTable,
} from 'src/components/table';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { DisciplineTableRow } from './Discipline-table-row';
import { useGetDisciplineMutation } from './http/useGetDisciplineMutation';

const TABLE_HEAD = [
  { _id: 'disciplineName', label: 'Discipline Name', width: 150 },
  { _id: 'disciplineSpanishName', label: 'Spanish Name', width: 150 },
  { _id: 'disciplineDescription', label: 'Description', width: 200 },
  { _id: 'createdAt', label: 'Created At', width: 150 },
  { _id: 'actions', label: 'Actions', width: 88 },
];

export function DiscipleListCategory() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);

  const { data, isLoading } = useGetDisciplineMutation();
  console.log(data);

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
        heading="All Discipline"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'All Discipline' }]}
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
                {data.map((row, i) => (
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
