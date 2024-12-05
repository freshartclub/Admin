import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { ArtistListType } from 'src/types/artist/ArtistDetailType';
import { phoneNo } from 'src/utils/change-case';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistListType;
  url: string;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function ArtistPendingRequest({
  row,
  url,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.nickName) fullName += ' ' + `"${val?.nickName}"`;
    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  return (
    <TableRow hover>
      <TableCell>
        <Stack spacing={1} direction="row" alignItems="center">
          <Avatar alt={row?.artistName} src={`${url}/users/${row?.profile?.mainImage}`} />
          <Stack
            className=" cursor-pointer"
            sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}
          >
            <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
              {name(row)}
            </Link>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row?.email}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.userId}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNo(row?.phone)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.country}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', display: 'flex', gap: 2 }}>
        <RouterLink
          href={`${paths.dashboard.artist.addArtist}?id=${row._id}`}
          className="bg-black text-white py-2 px-2 rounded-md"
        >
          Continue Edit
        </RouterLink>
      </TableCell>
    </TableRow>
  );
}
