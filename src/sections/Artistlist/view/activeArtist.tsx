import {
  Box,
  Card,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import { getComparator, TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { imgUrl } from 'src/utils/BaseUrls';
import { ListArtist } from '../activeArtist-table-row';
import { useGetAllActiveArtist } from '../http/useGetAllActiveArtist';

const TABLE_HEAD = [
  { id: 'artistName', label: 'Artist Name​', width: 200 },
  { id: 'artistId', label: 'Artist Id', width: 150 },
  { id: 'phone', label: 'Contact', width: 180 },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'createdAt', label: 'Created At', width: 130 },
  { id: 'action', label: 'Action', width: 88 },
];

export function ListArtists() {
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

  const [_userList, setUserList] = useState([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 800);

  const { data, isLoading } = useGetAllActiveArtist(
    debounceSearch,
    options.currPage,
    options.cursor,
    options.direction,
    options.limit
  );

  useEffect(() => {
    if (data) {
      setUserList(data.data || []);
      setNextCursor(data.nextCursor || '');
      setPrevCursor(data.prevCursor || '');
      setNotFound(data.data?.length === 0);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: _userList,
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
      <Stack marginBottom={2}>
        <TextField
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search By Artist Id, Name or Email..."
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
                  <ListArtist key={row._id} row={row} url={imgUrl} />
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
    </>
  );
}

type ApplyFilterProps = {
  inputData: any[];
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
