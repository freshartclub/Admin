import type { IInvoice } from 'src/types/invoice';

import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
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
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';
import { KbTableRow } from './Kb-table-row';
import { useGetAllKB } from './http/useGetAllKB';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'kbGrp', label: 'KB Group', width: 100 },
  { id: 'kbTitle', label: 'Title', width: 150 },
  { id: 'tags', label: 'Tags', width: 100 },
  { id: 'createdAt', label: 'Created At', width: 100 },
  { id: 'actions', label: 'Actions', width: 80 },
];

export function KbListView() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [_kbList, setKBList] = useState<IInvoice[]>([]);
  const [search, setSearch] = useState<string>('');
  const [grp, setGrp] = useState<string>('');
  const debounceSearch = useDebounce(search, 500);
  const picklist = RenderAllPicklist('KB Group');

  const { data, isLoading } = useGetAllKB(debounceSearch, grp);

  useEffect(() => {
    if (data) {
      setKBList(data);
      setNotFound(data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _kbList,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
      <CustomBreadcrumbs
        heading="KB List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'KB List' }]}
        action={
          <RouterLink href={`${paths.dashboard.kbdatabase.add}`}>
            <span className="bg-black text-white justify-center rounded-md flex items-center px-2 py-3 gap-2">
              <Iconify icon="mingcute:add-line" /> Add KB
            </span>
          </RouterLink>
        }
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      <Stack direction={{ xs: 'column', md: 'row', lg: 'row' }} spacing={2} mb={2}>
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By KB Title/Tags..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="KB Group">KB Group</InputLabel>
          <Select
            label="KB Group"
            inputProps={{ id: 'faq' }}
            onChange={(e) => setGrp(e.target.value)}
            value={grp}
            sx={{ textTransform: 'capitalize' }}
          >
            <MenuItem key={'All'} value={'All'}>
              {'All'}
            </MenuItem>
            {picklist &&
              picklist.length > 0 &&
              picklist.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Stack>

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
                  .map((row) => (
                    <KbTableRow key={row._id} row={row} />
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
