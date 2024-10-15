import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import moment from 'moment';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import { useUnsuspendArtistMutation } from './http/useUnsuspendArtistMutation';
import { Dialog, DialogActions, DialogContentText, DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { useState } from 'react';

// import { UserQuickEditForm } from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: AddArtistComponentProps;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function SuspendedArtistList({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const confirm = useBoolean();
  const [showPop , setShowPop] = useState(false)
  

  const popover = usePopover();

  const quickEdit = useBoolean();
  const navigate = useNavigate();

  const { mutate, isPending } = useUnsuspendArtistMutation(row._id);




  const handleUnsuspend = (id)=>{
    mutate()
  }

  const dialogBox = (
    <Dialog
      open={showPop}
      onClose={() => {
        setShowPop(false);
      }}
    >
      <DialogTitle>Unsuspend Artist</DialogTitle>
      <DialogContent>
        <DialogContentText>Are You Sure you want to Unsuspend this Artist?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => handleUnsuspend(row._id)}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {isPending ? 'Loading...' : ' Unsuspend Artist'}
        </button>
      </DialogActions>
    </Dialog>
  );

  


  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={1} direction="row" alignItems="center">
            <Stack
              className=" cursor-pointer"
              sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}
            >
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row.artistName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          {row.address.city}
        </TableCell>

        <div className={`w-fit h-fit flex items-center mt-5 `}>{row.address.country}</div>

        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          {moment(row.createdAt).format('YYYY-MM-DD')}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          <Button 
          onClick={() => setShowPop(true)}
          variant="contained">Unsuspend Artist</Button>
        </TableCell>
      </TableRow>
      {dialogBox}
     

      {/* <CustomPopover
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
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Remove Request
          </MenuItem>

          <MenuItem onClick={() => handelEdit(row._id)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover> */}

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}
