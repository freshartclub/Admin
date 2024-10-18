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
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { fDate } from 'src/utils/format-time';
import { phoneNo } from 'src/utils/change-case';
import { IconButton } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  row: AddArtistComponentProps;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function ArtistRequest({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const confirm = useBoolean();
  const popover = usePopover();
  // const quickEdit = useBoolean();
  const navigate = useNavigate();

  const handelEdit = (id) => {
    navigate(paths.dashboard.artist.addArtist + '?=' + id);
  };

  const extisting = row?.userId ? true : false;

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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNo(row?.phone)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          {row?.address?.city}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          {row.address.country}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          {fDate(row?.createdAt)}
        </TableCell>

        <TableCell sx={{ alignContent: 'center' }}>
          <RouterLink>
            <Iconify icon="mdi:eye-outline" />
          </RouterLink>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }} spacing={2}>
          <RouterLink
            href={`${paths.dashboard.artist.createArtist}?id=${row._id}&extisting=${extisting}`}
          >
            <span className="bg-black text-white py-2 px-2 rounded-md flex items-center gap-2">
              <Iconify icon="mingcute:add-line" /> Create Artist
            </span>
          </RouterLink>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
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
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Reject
          </MenuItem>
          {/* right now we just write here to remember that we have to change this */}
          {/* onClick={() => handelEdit(row._id)} */}
          <MenuItem>
            <Iconify icon="mdi:ban" />
            Ban
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to Reject this request?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Reject
          </Button>
        }
      />
    </>
  );
}
