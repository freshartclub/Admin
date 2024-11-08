import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { ArtistDisciplineType } from 'src/types/artist/ArtistDetailType';
import useDeleteMediaMutation from './http/useDeleteMediaMutation';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistDisciplineType;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function MediaTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const navigate = useNavigate();
  const { mutate, isPending } = useDeleteMediaMutation();

  const confirm = useBoolean();
  const popover = usePopover();

  const deleteMedia = () => {
    mutate(row._id);
  };

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.mediaName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.spanishMediaName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.discipline.map((discipline: any) => discipline.disciplineName).join(', ')}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.createdAt}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'end' }}>
          <IconButton
            sx={{ marginRight: '10px' }}
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
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
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem
            onClick={() => navigate(`${paths.dashboard.category.mediasupport.add}?id=${row._id}`)}
          >
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
          <Button variant="contained" color="error" onClick={deleteMedia}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
