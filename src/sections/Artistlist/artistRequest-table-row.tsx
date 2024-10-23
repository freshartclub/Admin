import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { fDate } from 'src/utils/format-time';
import { phoneNo } from 'src/utils/change-case';
import { Avatar, DialogActions, DialogTitle, IconButton } from '@mui/material';
import { useRejectRequestMutation } from './http/useRejectRequestMutation';
import { useBanRequestMutation } from './http/useBanRequestMutation';
import { useState } from 'react';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  row: AddArtistComponentProps;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function ArtistRequest({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const popover = usePopover();

  const [banPopUp, setBanPopUp] = useState(false);
  const [rejectPopUp, setRejectPopUp] = useState(false);

  const { mutate, isPending } = useRejectRequestMutation(setRejectPopUp);
  const { mutate: banMutate, isPending: banPending } = useBanRequestMutation(setBanPopUp);

  const extisting = row?.userId ? true : false;

  const handleReject = async (id) => {
    mutate(id);
  };

  const handleBan = async (id) => {
    banMutate(id);
  };

  const banDialogBox = (
    <Dialog
      open={banPopUp}
      onClose={() => {
        setBanPopUp(false);
      }}
    >
      <DialogTitle>Ban Artist Request</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are You Sure you want to ban this Artist Request. This action is irreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => handleBan(row._id)}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {banPending ? 'Loading...' : 'Ban Request'}
        </button>
      </DialogActions>
    </Dialog>
  );

  const rejectDialogBox = (
    <Dialog
      open={rejectPopUp}
      onClose={() => {
        setRejectPopUp(false);
      }}
    >
      <DialogTitle>Reject Artist Request</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are You Sure you want to reject this Artist Request. This action is irreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => handleReject(row._id)}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {isPending ? 'Loading...' : 'Reject Request'}
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
            <Avatar alt={row?.artistName} src={row?.profile?.mainImage} />
            <Stack
              className=" cursor-pointer"
              sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}
            >
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row?.artistName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNo(row?.phone)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.address?.city}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.address.country}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>
        <TableCell sx={{ alignContent: 'center' }}>
          <RouterLink href={`${paths.dashboard.artist.createArtist}/${row._id}`}>
            <Iconify icon="mdi:eye-outline" />
          </RouterLink>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <RouterLink
            href={`${paths.dashboard.artist.createArtist}?id=${row._id}&extisting=${extisting}`}
          >
            <span className="bg-black text-white py-2 px-2 rounded-md flex items-center gap-2">
              <Iconify icon="mingcute:add-line" /> Create Artist
            </span>
          </RouterLink>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              // confirm.onTrue();
              popover.onClose();
              setRejectPopUp(true);
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Reject
          </MenuItem>
          <MenuItem
            onClick={() => {
              // confirm.onTrue();
              popover.onClose();
              setBanPopUp(true);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="mdi:ban" />
            Ban
          </MenuItem>
        </MenuList>
      </CustomPopover>
      {banDialogBox}
      {rejectDialogBox}
    </>
  );
}
