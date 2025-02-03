import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { ArtistListType } from 'src/types/artist/ArtistDetailType';
import { phoneNo } from 'src/utils/change-case';
import { fDate } from 'src/utils/format-time';
import { useUnsuspendArtistMutation } from './http/useUnsuspendArtistMutation';
import lang from '../artist/addArtist/lang.json';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistListType;
};

export function SuspendedArtistList({ row }: Props) {
  const [showPop, setShowPop] = useState(false);

  const language = row?.language || 'Spanish';
  const selectedLang = lang.find((item) => item.name === language);

  const { mutate, isPending } = useUnsuspendArtistMutation(row._id, selectedLang?.code || 'ES');

  const handleUnsuspend = (id) => {
    mutate();
    setShowPop(false);
  };

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
      <TableRow hover>
        <TableCell>
          <Stack spacing={1} direction="row" alignItems="center">
            <Stack
              className=" cursor-pointer"
              sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}
            >
              <Link color="inherit" sx={{ cursor: 'pointer' }}>
                {row?.artistName} {row?.artistSurname1} {row?.artistSurname2}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.phone ? phoneNo(row?.phone) : 'N/A'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.city}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.country}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Button onClick={() => setShowPop(true)} variant="contained">
            Unsuspend Artist
          </Button>
        </TableCell>
      </TableRow>
      {dialogBox}
    </>
  );
}
