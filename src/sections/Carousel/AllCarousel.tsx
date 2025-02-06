import type { IOrderItem } from 'src/types/order';

import { Card, InputAdornment, Stack, TextField } from '@mui/material';
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
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { useGetAllCarousel } from './http/useGetAllCarousel';
import { CarouselListRow } from './CarouselListRow';
import { Table } from '@mui/material';
import { TableBody } from '@mui/material';

const TABLE_HEAD = [
  { id: 'type', label: 'Type', width: 90 },
  { id: 'title', label: 'Title', width: 100 },
  { id: 'subtitle', label: 'Sub Title', width: 130 },
  { id: 'isDeleted', label: 'Status', width: 130 },
  { id: 'createdAt', label: 'Created At', width: 130 },
  { id: 'actions', label: 'Action', width: 100 },
];

export function AllCarousel() {
  const [search, setSearch] = useState<string>('');

  const debounceSearch = useDebounce(search, 800);
  const { data, isLoading } = useGetAllCarousel(debounceSearch);

  // const [selectedTab, setSelectedTab] = useState('All');
  const table = useTable();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
      <CustomBreadcrumbs
        heading="Carousel List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Craousel List' }]}
        sx={{ mb: 3 }}
      />
      <Stack
        direction={{ xs: 'column', md: 'row', lg: 'row' }}
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Carousel Title/Sub Title"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <RouterLink className="md:w-max w-full" href={`${paths.dashboard.customise.carousel.add}`}>
          <span className="bg-black justify-center text-white rounded-md flex items-center px-2 py-3 gap-2 w-full md:w-max">
            <Iconify icon="mingcute:add-line" /> Add Carousel
          </span>
        </RouterLink>
      </Stack>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Card>
            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                      <CarouselListRow key={row._id} row={row} />
                    ))}
                  <TableEmptyRows
                    height={table.dense ? 56 : 76}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </Card>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
}

type ApplyFilterProps = {
  inputData: IOrderItem[];
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
