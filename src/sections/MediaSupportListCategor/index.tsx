import type { IUserItem } from 'src/types/user';

import { Card, InputAdornment, Table, TableBody } from '@mui/material';
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
  useTable,
} from 'src/components/table';
import { paths } from 'src/routes/paths';
import { useGetMediaListMutation } from './http/useGetMediaListMutation';
import { MediaTableRow } from './media-table-row';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';
import { TextField } from '@mui/material';
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import axiosInstance from 'src/utils/axios';
import { saveAs } from 'file-saver';

const TABLE_HEAD = [
  { id: 'mediaName', label: 'Media Name', width: 150 },
  { id: 'discipline', label: 'Discipline', width: 220 },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'createdAt', label: 'Created At', width: 100 },
  { id: 'actions', label: 'Actions', width: 88 },
];

export function MediaSupportListCategory() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 800);
  const [_list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useGetMediaListMutation(debounceSearch);

  useEffect(() => {
    if (data) {
      setList(data);
      setNotFound(data.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _list,
    comparator: getComparator(table.order, table.orderBy),
  });

  const downloadCategoryExcel = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `${ARTIST_ENDPOINTS.downloadCategory}?s=${search}&fieldName=mediaName&type=MediaSupport`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Media_List.xlsx');
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CustomBreadcrumbs
        heading="Media & Support List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Media & Support List' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
        action={
          <div className="flex gap-2">
            <RouterLink href={`${paths.dashboard.category.mediasupport.add}`}>
              <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-1">
                <Iconify icon="mingcute:add-line" /> Add Media
              </span>
            </RouterLink>
            <span
              onClick={() => downloadCategoryExcel()}
              className={`${loading ? 'cursor-not-allowed opacity-50' : ''} cursor-pointer bg-green-600 text-white rounded-md flex items-center px-2 py-3 gap-1`}
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
      />
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search By Media Name/Discipline..."
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
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <MediaTableRow key={row._id} row={row} />
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
