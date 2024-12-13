import { Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, Table, TableBody, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
  useTable,
} from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import type { IUserItem } from 'src/types/user';
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
  const [picklist, setPicklist] = useState<string>('');
  const [_list, setList] = useState([]);
  const { data, isLoading } = useGetPicklistMutation();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');

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

  const handleDeleteRow = (id: string) => {};
  const handleEditRow = (id: string) => {};

  const handleChange = (id: string) => {
    if (!name) return toast.error('Picklist Name is required!');
    const data = { picklistName: name };
    mutateAsync(data).then(() => setOpen(false));
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
        <Typography variant="body1" sx={{color:'red'}}>
          Please be Cautious while changing the Picklist Name. As if this Picklist is already in use
          somwhere in the application, then you have to change the Picklist Name there as well.
          Otherwise the data of this Picklist will not be accessible.
          <br></br>
          If this Picklist is being used somewhere, change the Picklist
          Name with the new Picklist Name in the application as well.
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
          <div className="flex gap-2">
            <RouterLink href={`${paths.dashboard.category.picklist.add}`}>
              <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-1">
                <Iconify icon="mingcute:add-line" /> Add Picklist Item
              </span>
            </RouterLink>
            <RouterLink href={`#`}>
              <span className="bg-green-600 text-white rounded-md flex items-center px-2 py-3 gap-1">
                <Iconify icon="mingcute:add-line" /> Export CSV
              </span>
            </RouterLink>
          </div>
        }
      />

      <Stack direction={'row'} spacing={2} alignItems={'center'} sx={{ mb: 2 }}>
        <FormControl sx={{ flexShrink: 0, width: 300 }}>
          <InputLabel htmlFor="Picklist">Select Picklist</InputLabel>

          <Select
            label="Select Picklist"
            inputProps={{ id: 'Picklist' }}
            onChange={(e) => setPicklist(e.target.value)}
            value={picklist}
            sx={{ textTransform: 'capitalize' }}
          >
            {data &&
              data.length > 0 &&
              data.map((option) => (
                <MenuItem key={option.picklistName} value={option.picklistName}>
                  {option.picklistName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <span
          onClick={() => setOpen(true)}
          className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-1 cursor-pointer"
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
                  <PicklistTableRow
                    key={row._id}
                    row={row}
                    _id={id}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                    onDeleteRow={() => handleDeleteRow(row._id)}
                    onEditRow={() => handleEditRow(row._id)}
                  />
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
