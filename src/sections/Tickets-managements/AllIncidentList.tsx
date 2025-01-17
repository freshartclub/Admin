import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { ArtistListType } from 'src/types/artist/ArtistDetailType';
import { fDate, fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistListType;
};

export function AllIncidentList({ row }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.incGroup}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.incType}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.title}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.status}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.severity}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTime(row?.initTime)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTime(row?.endTime)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <IconButton
            onClick={() => navigate(`${paths.dashboard.tickets.addIncident}?id=${row?._id}`)}
          >
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}
