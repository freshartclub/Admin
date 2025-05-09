import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { InputAdornment, Select, TextField } from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { useGetAllVisualize } from './http/useGetAllVisualize';
import { VisualizeTableRow } from './table-row-visualize';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { OutlinedInput } from '@mui/material';
import { MenuItem } from '@mui/material';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'group', label: 'Group' },
  { id: 'dimension_height', label: 'Dimension Height' },
  { id: 'dimension_width', label: 'Dimension Weight' },
  { id: 'tags', label: 'Tags' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'actions', label: 'Action' },
];

// ----------------------------------------------------------------------

export function AllVisualize() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [group, setGroup] = useState<string>('All');
  const debounceSearch = useDebounce(search, 800);

  const { data, isLoading } = useGetAllVisualize(debounceSearch, group);
  const picklist = RenderAllPicklist('Visualize');

  useEffect(() => {
    if (data) {
      setList(data);
      setNotFound(data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: list,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
      <CustomBreadcrumbs
        heading="Visualize List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Visualize List' }]}
        action={
          <RouterLink href={`${paths.dashboard.visualize.add}`}>
            <span className="bg-black justify-center text-white rounded-md flex items-center px-2 py-3 gap-2">
              <Iconify icon="mingcute:add-line" /> Add Visualize
            </span>
          </RouterLink>
        }
        sx={{ mb: 2 }}
      />
      <div className="flex mb-4 justify-between gap-2 items-center">
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Name or Tags..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="Status">Status</InputLabel>

          <Select
            input={<OutlinedInput label="Group" />}
            inputProps={{ id: 'Status' }}
            onChange={(e) => setGroup(e.target.value)}
            value={group}
            sx={{ textTransform: 'capitalize' }}
          >
            <MenuItem value="All">All</MenuItem>
            {picklist && picklist.length > 0 ? (
              picklist.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="All">No Data</MenuItem>
            )}
          </Select>
        </FormControl>
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Card>
          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, i) => (
                    <VisualizeTableRow key={i} row={row} />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
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
      )}
    </>
  );
}

type ApplyFilterProps = {
  inputData: IInvoice[];
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
