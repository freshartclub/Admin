import {
  Autocomplete,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  MenuList,
  Stack,
  Table,
  TableBody,
  TextField,
  Typography,
} from '@mui/material';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
import { ARTIST_ENDPOINTS } from 'src/http/apiEndPoints/Artist';
import { RouterLink } from 'src/routes/components';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import type { IUserItem } from 'src/types/user';
import axiosInstance from 'src/utils/axios';
import { PicklistTableRow } from './Picklist-table-row';
import { useGetPicklistMutation } from './http/useGetPicklistMutation';
import useUpdatePicklistName from './http/useUpdateName';

const TABLE_HEAD = [
  { id: 'name', label: 'Field Name', width: 150 },
  { id: 'status', label: 'Status', width: 130 },
  { id: 'actions', label: 'Actions', width: 150 },
];

export function ListAllPicklist() {
  const table = useTable();
  const [notFound, setNotFound] = useState(false);
  const [_list, setList] = useState([]);
  const { data, isLoading } = useGetPicklistMutation();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);

  const confirm = useBoolean();
  const popover = usePopover();

  const selectedType = useSearchParams().get('selectedType');
  const [picklist, setPicklist] = useState<string>(selectedType ? selectedType : '');

  useEffect(() => {
    if (data) {
      if (!picklist && data.length > 0) {
        setPicklist(data[0].picklistName);
      }
      const list = data?.find((item) => item.picklistName === picklist);
      setId(list ? list?._id : '');
      setList(list ? list?.picklist : []);
    }
  }, [data, picklist]);

  const dataFiltered = applyFilter({
    inputData: _list,
    comparator: getComparator(table.order, table.orderBy),
  });

  const { mutateAsync, isPending } = useUpdatePicklistName(id);

  useEffect(() => {
    setNotFound(dataFiltered.length === 0);
  }, [dataFiltered]);

  const handleChange = (id: string) => {
    if (!name) return toast.error('Picklist Name is required!');
    const data = { picklistName: name };
    mutateAsync(data).then(() => setOpen(false));
  };

  const downloadPicklistExcel = async (term) => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(`${ARTIST_ENDPOINTS.downloadPicklist}?s=${term}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Pick_List.xlsx');
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeDialogBox = (
    <Dialog
      sx={{ width: '100vw' }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle sx={{ mb: 0, pb: 1 }}>
        <Typography variant="h5">Change Picklist Name - {picklist}</Typography>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body1" sx={{ color: 'red' }}>
          Please be Cautious while changing the Picklist Name. As if this Picklist is already in use
          somwhere in the application, then you have to change the Picklist Name there as well.
          Otherwise the data of this Picklist will not be accessible.
          <br></br>
          If this Picklist is being used somewhere, change the Picklist Name with the new Picklist
          Name in the application as well.
        </Typography>
        <input
          required
          className=" py-2 border-[1px] border-zinc-500 rounded-md px-2 outline-none"
          name="picklistName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Picklist Name"
        />
      </DialogContent>
      <DialogActions sx={{ display: 'flex', gap: 1 }}>
        <span
          onClick={() => handleChange(id)}
          className="text-white bg-black rounded-md px-3 py-2 cursor-pointer"
        >
          {isPending ? 'Saving...' : 'Save'}
        </span>

        <span
          onClick={() => setOpen(false)}
          className="text-white bg-red-500 rounded-md px-3 py-2 cursor-pointer"
        >
          Cancel
        </span>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading="All Picklists"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'All Picklists' }]}
        sx={{ mb: 3 }}
        action={
          <div className="bread-links flex gap-2">
            <RouterLink href={`${paths.dashboard.category.picklist.add}?selectedType=${picklist}`}>
              <span className="bg-black text-white rounded-md flex justify-center items-center px-2 py-3 gap-1">
                <Iconify icon="mingcute:add-line" /> Add Picklist Item
              </span>
            </RouterLink>
            <span
              onClick={popover.onOpen}
              className={`${loading ? 'cursor-not-allowed opacity-50' : ''} justify-center cursor-pointer bg-green-600 text-white rounded-md flex items-center px-2 py-3 gap-1`}
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

      <Stack
        direction={{ xs: 'column-reverse', md: 'row', lg: 'row' }}
        spacing={2}
        alignItems={'center'}
        marginBottom={2}
      >
        <Autocomplete
          fullWidth
          options={data ? data : []}
          getOptionLabel={(option) => option.picklistName || ''}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Type or Select Picklist Name"
              placeholder="Type or Select Picklist Name"
            />
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              setPicklist(newValue.picklistName);

              const url = new URL(window.location.href);
              if (url.searchParams.has('selectedType')) {
                url.searchParams.delete('selectedType');
                window.history.replaceState({}, document.title, url);
              }
            }
          }}
          value={data ? data.find((item) => item.picklistName === picklist) : null}
          isOptionEqualToValue={(option, value) => option?.picklistName === value?.picklistName}
        />

        <span
          onClick={() => setOpen(true)}
          className="bg-black text-white rounded-md flex justify-center items-center px-2 py-3 gap-1 cursor-pointer w-full md:w-[21rem]"
        >
          <Iconify icon="solar:pen-bold" /> Edit Picklist Name
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
                  <PicklistTableRow key={row._id} row={row} _id={id} />
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
              downloadPicklistExcel('All');
            }}
          >
            Export All Data
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
              downloadPicklistExcel(picklist);
            }}
          >
            Export Selected Data
          </MenuItem>
        </MenuList>
      </CustomPopover>
      {changeDialogBox}
    </>
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
