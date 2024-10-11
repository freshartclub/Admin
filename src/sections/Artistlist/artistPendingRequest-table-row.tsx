import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import RLInk from 'react-router-dom';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import moment from 'moment';
import { RouterLink } from 'src/routes/components';

// import { UserQuickEditForm } from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: AddArtistComponentProps;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function ArtistPendingRequest({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();
  const navigate = useNavigate();

  const handelEdit = (id) => {
    navigate(paths.dashboard.artist.addArtist + '?id=' + id);
  };

  console.log(row);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={1} direction="row" alignItems="center">
            {/* <Avatar alt={row.uploadImage} src={row.profile.mainImage} /> */}

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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.userId}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          {row.phone}
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.isActivated}</TableCell> */}

        {/* <TableCell>
          <Label
            variant="soft"
            color={
              (row.isActive === true && 'success') ||
              (row.isActive === false && 'warning') ||
            //   (row.status === 'banned' && 'error') ||
              'default'
            }
          >
            {row.isActive}
          </Label>
        </TableCell> */}
        {/* <div className={`${row.isActive == true ? "bg-slate-500 rounded-md px-2 py-1 text-white" : "bg-red-300 rounded-md px-2 py-1"} ${row.isActive == true && 'Active'}`}>{row.isActive}</div> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          {row.address?.country}
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>{row.isActive}</TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          {moment(row.createdAt).format('YYYY-MM-DD')}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', display:"flex",  gap:2}} spacing={2}>
          {
          //   row.isActivated === false && <RouterLink href={`${paths.dashboard.artist.addArtist}?id=${row._id}`}>
          //   <span className="bg-green-600 text-white py-2 px-2 rounded-md"> Acivate</span>
          // </RouterLink>
          }
          <RouterLink href={`${paths.dashboard.artist.addArtist}?id=${row._id}`}>
            <span className="bg-black text-white py-2 px-2 rounded-md"> Continue Edit</span>
          </RouterLink>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

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
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Remove From Pending
          </MenuItem>

          <MenuItem onClick={() => handelEdit(row._id)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
