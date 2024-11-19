import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { ArtistDisciplineType } from 'src/types/artist/ArtistDetailType';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistDisciplineType;
  _id: string;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function PicklistTableRow({
  row,
  _id,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const navigate = useNavigate();

  const confirm = useBoolean();
  const popover = usePopover();

  const deleteStyle = () => {
    popover.onClose();
    confirm.onFalse();
  };

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <span
            className={`w-fit flex items-center rounded-2xl px-2 py-1 ${!row?.isDeleted ? 'bg-[#E7F4EE] text-[#0D894F]' : 'bg-[#FEEDEC] text-[#F04438]'}`}
          >
            {row?.isDeleted ? 'Inactive' : 'Active'}
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
          {/* {row?.isDeleted ? null : (
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
          )} */}

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
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={deleteStyle}>
            Delete
          </Button>
        }
      />
    </>
  );
}
