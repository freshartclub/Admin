import { Avatar, Link, ListItemText, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ArtistDisciplineType } from 'src/types/artist/ArtistDetailType';
import { imgUrl } from 'src/utils/BaseUrls';
import useDeleteArtworkItem from './http/useDeleteArtworkItem';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistDisciplineType;
  _id: string;
  type: string;
};

export function HomeArtworkRow({ row, type, _id }: Props) {
  const { mutateAsync, isPending } = useDeleteArtworkItem(_id, row?._id);
  const confirm = useBoolean();

  const deleteStyle = () => {
    mutateAsync().then(() => {
      confirm.onFalse();
    });
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row?.artworkName} src={`${imgUrl}/users/${row?.img}`} />

            <ListItemText
              disableTypography
              primary={<Typography variant="body2">{row?.artworkName}</Typography>}
              secondary={
                <Link variant="body2" sx={{ color: 'text.disabled', cursor: 'pointer' }}>
                  {row?.artworkId}
                </Link>
              }
            />
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{type}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <span className="w-fit flex items-center rounded-2xl px-2 py-1 bg-[#E7F4EE] text-[#0D894F]">
            Active
          </span>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <span
            className="flex items-center gap-2 border cursor-pointer border-red-500 rounded p-2 w-fit text-red-500"
            onClick={() => confirm.onTrue()}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </span>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete this artwork from this section. This action cannot be reversed and artwork will removed permanently?"
        action={
          <Button variant="contained" color="error" onClick={deleteStyle}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
