import type { IInvoice } from 'src/types/invoice';

import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { FAQ_GROUP_OPTIONS } from 'src/_mock';
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
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField } from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { FaqTableRow } from './faq-table-row';
import { useGetAllFAQ } from './http/useGetAllFAQ';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'faqGrp', label: 'FAQ Group', width: 120 },
  { id: 'faqQues', label: 'Question', width: 200 },
  { id: 'tags', label: 'Tags', width: 150 },
  { id: 'CreatedAt', label: 'Created At', width: 100 },
  { id: 'actions', label: 'Action', width: 80 },
];

// ----------------------------------------------------------------------

export function FaqListView() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [_faqList, setFAQList] = useState<IInvoice[]>([]);
  const [search, setSearch] = useState<string>('');
  const [grp, setGrp] = useState<string>('');
  const debounceSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetAllFAQ(debounceSearch, grp);

  useEffect(() => {
    if (data?.data) {
      setFAQList(data.data);
      setNotFound(data?.data?.length === 0);
    }
  }, [data?.data]);

  const dataFiltered = applyFilter({
    inputData: _faqList,
    comparator: getComparator(table.order, table.orderBy),
  });

  const handleDeleteRow = (id: string) => {};
  const handleEditRow = (id: string) => {};
  const handleViewRow = (id: string) => {};

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="FAQ List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'FAQ List' }]}
          action={
            <RouterLink href={`${paths.dashboard.faq.add}`}>
              <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2">
                <Iconify icon="mingcute:add-line" /> Add FAQ
              </span>
            </RouterLink>
          }
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <Stack sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }} direction="row">
          <TextField
            sx={{ width: '70%' }}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search By FAQ Question..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ width: '28%' }}>
            <InputLabel htmlFor="FAQ Group">FAQ Group</InputLabel>
            <Select
              input={<OutlinedInput label="FAQ Group" />}
              inputProps={{ id: 'faq' }}
              onChange={(e) => setGrp(e.target.value)}
              value={grp}
              sx={{ textTransform: 'capitalize' }}
            >
              <MenuItem key={'All'} value={'All'}>
                {'All'}
              </MenuItem>
              {FAQ_GROUP_OPTIONS.map((option) => (
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
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
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
                      <FaqTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
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
      </DashboardContent>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
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
