import type { IOrderItem } from 'src/types/order';
import {
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useEffect, useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import { getComparator, TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { imgUrl } from 'src/utils/BaseUrls';
import { useGetAllOrders } from '../http/useGetAllOrder';
import { OrderTableRow } from '../order-table-row';

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
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [options, setOptions] = useState({
    cursor: '',
    direction: '',
    limit: 10,
    currPage: 1,
  });

  const [search, setSearch] = useState('');
  const [_orderList, setOrderList] = useState<IOrderItem[]>([]);

  const debounceSearch = useDebounce(search, 800);
  const { data, isLoading } = useGetAllOrders(
    debounceSearch,
    options.currPage,
    options.cursor,
    options.direction,
    options.limit
  );

  useEffect(() => {
    if (data) {
      setOrderList(data.data);
      setNextCursor(data.nextCursor || '');
      setPrevCursor(data.prevCursor || '');
      setNotFound(data.data?.length === 0);
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
          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered.map((row) => (
                  <OrderTableRow key={row._id} row={row} url={imgUrl} />
                ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
          <Stack direction="row" justifyContent="space-between">
            <FormControlLabel
              className="dense-table"
              sx={{ pl: 2 }}
              label="Dense"
              control={<Switch name="dense" checked={table.dense} onChange={table.onChangeDense} />}
            />
            <Box className="row-table" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="body2">Rows per page:</Typography>

                <Select
                  onChange={(e) =>
                    setOptions({ ...options, cursor: '', currPage: 1, limit: e.target.value })
                  }
                  value={options.limit}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                >
                  {[5, 10, 25].map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {`${(options.currPage - 1) * options.limit + 1} - ${Math.min(options.currPage * options.limit, data?.totalCount)} of ${data?.totalCount}`}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    disabled={!prevCursor || isLoading}
                    sx={{
                      bgcolor: 'default.light',
                      color: `${prevCursor ? 'black' : 'text.disabled'}`,
                      width: 32,
                      height: 32,
                    }}
                    onClick={() => {
                      setOptions({
                        ...options,
                        cursor: prevCursor,
                        direction: 'prev',
                        currPage: options.currPage === 1 ? 1 : options.currPage - 1,
                      });
                    }}
                  >
                    <Iconify icon="weui:back-filled" />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: 'default.light',
                      color: `${nextCursor ? 'black' : 'text.disabled'}`,
                      width: 32,
                      height: 32,
                    }}
                    onClick={() => {
                      setOptions({
                        ...options,
                        cursor: nextCursor,
                        direction: 'next',
                        currPage: options.currPage + 1,
                      });
                    }}
                    disabled={!nextCursor || isLoading}
                  >
                    <Iconify sx={{ transform: 'rotate(180deg)' }} icon="weui:back-filled" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Stack>
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
