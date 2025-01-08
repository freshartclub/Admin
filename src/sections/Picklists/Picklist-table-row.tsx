import Button from '@mui/material/Button';
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
import useDeletePicklist from './http/useDeletePicklist';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistDisciplineType;
  _id: string;
};

export function PicklistTableRow({ row, _id }: Props) {
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useDeletePicklist(_id, row?.name);

  const confirm = useBoolean();
  const popover = usePopover();

  const deleteStyle = () => {
    mutateAsync().then(() => {
      popover.onClose();
      confirm.onFalse();
    });
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <span className="w-fit flex items-center rounded-2xl px-2 py-1 bg-[#E7F4EE] text-[#0D894F]">
            Active
          </span>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
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
            onClick={() =>
              navigate(`${paths.dashboard.category.picklist.add}?id=${_id}&name=${row?.name}`)
            }
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
        content="Are you sure want to delete this picklist item?"
        action={
          <Button variant="contained" color="error" onClick={deleteStyle}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
