import type { IOrderItem } from 'src/types/order';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { OrderTableRow } from '../order-table-row';
import { imgUrl } from 'src/utils/BaseUrls';
import { useGetAllOrders } from '../http/useGetAllOrder';
import { Stack } from '@mui/material';
import { TextField } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useDebounce } from 'src/routes/hooks/use-debounce';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'orderID', label: 'Order ID', width: 88 },
  { id: 'artistName', label: 'User Name', width: 140 },
  {
    id: 'quantity',
    label: 'Total Items',
    width: 120,
  },
  { id: 'subTotal', label: 'Total Price', width: 140 },
  { id: 'status', label: 'Status', width: 110 },
  { id: 'createdAt', label: 'Date', width: 140 },
  { id: 'action', label: 'Actions', width: 88 },
];

// ----------------------------------------------------------------------

export function OrderListView() {
  const table = useTable();

  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState('');
  const [_orderList, setOrderList] = useState<IOrderItem[]>([]);
  const debounceSearch = useDebounce(search, 800);

  const { data, isLoading } = useGetAllOrders(debounceSearch);

  useEffect(() => {
    if (data) {
      setOrderList(data);
      setNotFound(data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _orderList,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Order List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Order List' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      <Stack marginBottom={2}>
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Order Id, User/Artist Id, User Name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Card>
          <Box sx={{ position: 'relative' }}>
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
                      <OrderTableRow key={row._id} row={row} url={imgUrl} />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

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
  );
}

// ----------------------------------------------------------------------

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
