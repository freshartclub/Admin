import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { ArtistListType } from 'src/types/artist/ArtistDetailType';
import { fDate, fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistListType;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function AllIncidentList({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.incGroup}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.incType}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.status}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.initTime)} {fTime(row?.initTime)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.endTime)} {fTime(row?.endTime)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {fDate(row?.createdAt)} {fTime(row?.createdAt)}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <IconButton onClick={popover.onOpen}>
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
          <MenuItem>
            <Iconify icon="eva:edit-fill" />
            Edit Incident
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
