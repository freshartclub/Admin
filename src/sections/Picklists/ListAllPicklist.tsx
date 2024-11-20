import type { IUserItem } from 'src/types/user';

import { Card, FormControl, InputLabel, MenuItem, Select, Table, TableBody } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  useTable,
} from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { PicklistTableRow } from './Picklist-table-row';
import { useGetPicklistMutation } from './http/useGetPicklistMutation';

const TABLE_HEAD = [
  { id: 'name', label: 'Field Name', width: 150 },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'actions', label: 'Actions', width: 150 },
];

export function ListAllPicklist() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [picklist, setPicklist] = useState<string>('');
  const [_list, setList] = useState([]);
  const { data, isLoading } = useGetPicklistMutation();
  const [id, setId] = useState('');

  useEffect(() => {
    if (data) {
      if (!picklist && data.length > 0) {
        setPicklist(data[0].picklistName);
      }
      const list = data?.find((item) => item.picklistName === picklist);
      setId(list ? list?._id : '');
      setList(list ? list?.picklist : []);
    }
  }, [data, picklist]);

  const dataFiltered = applyFilter({
    inputData: _list,
    comparator: getComparator(table.order, table.orderBy),
  });

  useEffect(() => {
    setNotFound(dataFiltered.length === 0);
  }, [dataFiltered]);

  const handleDeleteRow = (id: string) => {};
  const handleEditRow = (id: string) => {};

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <CustomBreadcrumbs
        heading="All Picklists"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'All Picklists' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
        action={
          <div className="flex gap-2">
            <RouterLink href={`${paths.dashboard.category.picklist.add}`}>
              <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-1">
                <Iconify icon="mingcute:add-line" /> Add Picklist
              </span>
            </RouterLink>
            <RouterLink href={`#`}>
              <span className="bg-green-600 text-white rounded-md flex items-center px-2 py-3 gap-1">
                <Iconify icon="mingcute:add-line" /> Export CSV
              </span>
            </RouterLink>
          </div>
        }
      />
      <FormControl sx={{ flexShrink: 0, width: 300, mb: 2 }}>
        <InputLabel htmlFor="Picklist">Select Picklist</InputLabel>

        <Select
          label="Select Picklist"
          inputProps={{ id: 'Picklist' }}
          onChange={(e) => setPicklist(e.target.value)}
          value={picklist}
          sx={{ textTransform: 'capitalize' }}
        >
          {data &&
            data.length > 0 &&
            data.map((option) => (
              <MenuItem key={option.picklistName} value={option.picklistName}>
                {option.picklistName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
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
                {dataFiltered.map((row) => (
                  <PicklistTableRow
                    key={row._id}
                    row={row}
                    _id={id}
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
      )}
    </div>
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
