import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { ArtistListType } from 'src/types/artist/ArtistDetailType';
import { phoneNo } from 'src/utils/change-case';
import { fDate } from 'src/utils/format-time';
import { useBanRequestMutation } from './http/useBanRequestMutation';
import { useRejectRequestMutation } from './http/useRejectRequestMutation';
// ----------------------------------------------------------------------

type Props = {
  row: ArtistListType;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function ArtistRequest({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const popover = usePopover();

  const [banPopUp, setBanPopUp] = useState(false);
  const [showDocsPreview, setShowDocsPreview] = useState(false);
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

  const handleDocsPreview = () => {
    setShowDocsPreview(true);
  };

  const docsPreviewBox = (
    <Dialog
      sx={{ width: '37rem',margin:'auto' }}
      open={showDocsPreview}
      onClose={() => {
        setShowDocsPreview(false);
      }}
    >
      <DialogContent sx={{ p: 2, width: '100%' }}>
        <iframe
          src={`https://dev.freshartclub.com/images/documents/${row?.document?.documents[0]}`}
          width="100%"
          height="500px"
        ></iframe>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => setShowDocsPreview(false)}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );

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
            <Avatar alt={row?.artistName} src={`${row?.profile?.mainImage}`} />
            <Stack
              className=" cursor-pointer"
              sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}
            >
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row?.artistName} {row?.artistSurname1} {row?.artistSurname2}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNo(row?.phone)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.city}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.country}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>
        <TableCell sx={{ alignContent: 'center' }}>
          <span onClick={handleDocsPreview}>
            <Iconify icon="mdi:eye-outline" />
          </span>
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
      {docsPreviewBox}
    </>
  );
}
