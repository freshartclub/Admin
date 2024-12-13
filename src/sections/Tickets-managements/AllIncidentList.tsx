import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router';

import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
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
  const navigate = useNavigate();

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.incGroup}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.incType}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.status}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {fDate(row?.initTime)} {fTime(row?.initTime)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {fDate(row?.endTime)} {fTime(row?.endTime)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {fDate(row?.createdAt)} {fTime(row?.createdAt)}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <IconButton
            onClick={() =>
              navigate(`${paths.dashboard.tickets.addIncident}?id=${row?._id}`)
            }
          >
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
