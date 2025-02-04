import { Card, Table, TableBody } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, useTable } from 'src/components/table';
import { paths } from 'src/routes/paths';
import AddFileTableRow from './AddFileTableRow';
import { useGetFile } from './http/useGetFile';

const TABLE_HEAD = [
  { id: 'fileName', label: 'File Name' },
  { id: 'file', label: 'File' },
  { id: 'action', label: 'Action' },
];

const AddFile = () => {
  const table = useTable();
  const { data, isLoading } = useGetFile();

  return (
    <>
      <CustomBreadcrumbs
        heading="Add File"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add File' }]}
        sx={{ mb: 3 }}
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
                {data && data.map((row, i) => <AddFileTableRow key={i} row={row} />)}
              </TableBody>
            </Table>
          </Scrollbar>
        </Card>
      )}
    </>
  );
};

export default AddFile;
