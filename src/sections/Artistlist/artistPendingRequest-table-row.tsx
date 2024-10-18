import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { fDate } from 'src/utils/format-time';
import { phoneNo } from 'src/utils/change-case';
import { ArtistDetailType } from 'src/types/artist/ArtistDetailType';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistDetailType;
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
  // const quickEdit = useBoolean();
  const navigate = useNavigate();

  const handelEdit = (id) => {
    navigate(paths.dashboard.artist.addArtist + '?id=' + id);
  };

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
                {row?.artistName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.userId}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNo(row?.phone)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.address?.country}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', display: 'flex', gap: 2 }}>
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
