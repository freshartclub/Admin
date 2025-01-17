import type { IInvoice } from 'src/types/invoice';

import { Box, Card, InputAdornment, Table, TableBody, TextField } from '@mui/material';
import { saveAs } from 'file-saver';
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
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { RouterLink } from 'src/routes/components';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { CouponTableRow } from './coupon-table-row';
import { useGetCouponList } from './http/useGetCouponList';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Coupon Code' },
  { id: 'name', label: 'Coupon Name' },
  { id: 'validFrom', label: 'Valid From' },
  { id: 'validTo', label: 'Valid To' },
  { id: 'usage', label: 'Usage' },
  { id: 'discount', label: 'Discount %' },
  { id: 'disAmount', label: 'Discount Amount' },
  { id: 'action', label: 'Action' },
];

// ----------------------------------------------------------------------

export function CouponListView() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [_couponList, setCouponList] = useState<IInvoice[]>([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 800);
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useGetCouponList(debounceSearch);

  useEffect(() => {
    if (data) {
      setCouponList(data);
      setNotFound(data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _couponList,
    comparator: getComparator(table.order, table.orderBy),
  });

  const downloadArtistExcel = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(`${ARTIST_ENDPOINTS.downloadCoupon}?s=${search}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Coupon_List.xlsx');
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomBreadcrumbs
        heading="Coupon & Promotion List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Coupon List', href: paths.dashboard.couponandpromotions.list },
        ]}
        action={
          <div className="bread-links flex gap-2">
            <RouterLink href={`${paths.dashboard.couponandpromotions.add}`}>
              <span className="bg-black justify-center text-white rounded-md flex items-center px-2 py-3 gap-2">
                <Iconify icon="mingcute:add-line" /> Add Coupon
              </span>
            </RouterLink>
            <span
              onClick={() => downloadArtistExcel()}
              className={`${loading ? 'cursor-not-allowed opacity-50' : ''} cursor-pointer bg-green-600 justify-center text-white rounded-md flex items-center px-2 py-3 gap-1`}
            >
              {loading ? (
                'Downloading...'
              ) : (
                <>
                  <Iconify icon="mingcute:add-line" /> Export CSV
                </>
              )}
            </span>
          </div>
        }
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search By Coupon Name/Code..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Card>
          <Box sx={{ position: 'relative' }}>
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
                      <CouponTableRow key={row._id} row={row} />
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
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

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
