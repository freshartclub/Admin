import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  MenuList,
  OutlinedInput,
  Select,
  Stack,
  Table,
  TableBody
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
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
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { HomeArtworkRow } from './Home-Artwork-Row';
import { useGetHomeArtworks } from './http/useGetHomeArtworks';

const TABLE_HEAD = [
  { id: 'artworkName', label: 'Artwork Name', width: 150 },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'actions', label: 'Actions', width: 150 },
];

export function GetAllHomeArtwork() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [_list, setList] = useState([]);
  const [item, setItem] = useState({ _id: '', name: '' });

  const { data, isLoading } = useGetHomeArtworks();

  const confirm = useBoolean();
  const popover = usePopover();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const firstItem = data[0];
      const selectedItem = data.find((i) => i.artworksTitle === item.name) || firstItem;

      setItem({
        _id: selectedItem?._id,
        name: selectedItem?.artworksTitle,
      });
      setList(selectedItem?.artworks || []);
      setNotFound(data?.length === 0);
    }
  }, [data, _list, item.name]);

  const dataFiltered = applyFilter({
    inputData: _list || [],
    comparator: getComparator(table.order, table.orderBy),
  });

  return (
    <>
      <CustomBreadcrumbs
        heading="All Home Artworks"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'All Home Artworks' }]}
        sx={{ mb: 3 }}
        action={
          <RouterLink href={paths.dashboard.artwork.homeArtwork.add}>
            <span className="bg-black text-white rounded-md flex justify-center items-center px-2 py-3 gap-1">
              <Iconify icon="mingcute:add-line" /> Add Home Artwork
            </span>
          </RouterLink>
        }
      />

      <Stack
        direction={{ xs: 'column-reverse', md: 'row', lg: 'row' }}
        spacing={2}
        alignItems={'center'}
        marginBottom={2}
      >
        <FormControl fullWidth>
          <InputLabel htmlFor="Select Artwork Section Name">Select Artwork Section Name</InputLabel>

          <Select
            input={<OutlinedInput label="Select Artwork Section Name" />}
            inputProps={{ id: 'Select Artwork Section Name' }}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            value={item.name}
            sx={{ textTransform: 'capitalize' }}
          >
            {data && data.length > 0 ? (
              data.map((option, i) => (
                <MenuItem key={i} value={option.artworksTitle}>
                  {option.artworksTitle}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="All">No Data</MenuItem>
            )}
          </Select>
        </FormControl>

        <span
          onClick={() => navigate(`${paths.dashboard.artwork.homeArtwork.add}?id=${item._id}`)}
          className="bg-black text-white rounded-md flex justify-center items-center px-2 py-3 gap-1 cursor-pointer w-full md:w-[15rem]"
        >
          <Iconify icon="solar:pen-bold" /> Edit Artwork Section
        </span>
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
                  <HomeArtworkRow key={row._id} row={row} _id={item._id} />
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

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
              // downloadPicklistExcel('All');
            }}
          >
            Export All Data
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
              // downloadPicklistExcel(picklist);
            }}
          >
            Export Selected Data
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

type ApplyFilterProps = {
  inputData: any[];
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator }: ApplyFilterProps) {
  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
