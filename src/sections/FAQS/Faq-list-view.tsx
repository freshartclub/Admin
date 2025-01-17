import type { IInvoice } from 'src/types/invoice';

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

import { InputAdornment, TextField } from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { FaqTableRow } from './faq-table-row';
import { useGetAllFAQ } from './http/useGetAllFAQ';
import axiosInstance from 'src/utils/axios';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { saveAs } from 'file-saver';

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
  const debounceSearch = useDebounce(search, 800);
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useGetAllFAQ(debounceSearch);

  useEffect(() => {
    if (data) {
      setFAQList(data);
      setNotFound(data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _faqList,
    comparator: getComparator(table.order, table.orderBy),
  });

  const downloadArtistExcel = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(`${ARTIST_ENDPOINTS.downloadFAQ}?s=${search}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'FAQ_List.xlsx');
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomBreadcrumbs
        heading="FAQ List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'FAQ List' }]}
        action={
          <div className="bread-links flex gap-2">
            <RouterLink href={`${paths.dashboard.faq.add}`}>
              <span className="bg-black justify-center text-white rounded-md flex items-center px-2 py-3 gap-2">
                <Iconify icon="mingcute:add-line" /> Add FAQ
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
        sx={{marginBottom: 2}}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search By FAQ Question, Group or Tags..."
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
                    <FaqTableRow key={i} row={row} />
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
