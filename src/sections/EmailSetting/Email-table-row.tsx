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
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistDisciplineType;
};

export function EmailTableRow({ row }: Props) {
  const navigate = useNavigate();

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.emailType}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.emailLang}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <span
            className={`w-fit flex items-center rounded-2xl px-2 py-1 ${!row?.isDeleted ? 'bg-[#E7F4EE] text-[#0D894F]' : 'bg-[#FEEDEC] text-[#F04438]'}`}
          >
            {!row?.isDeleted ? 'Active' : 'Inactive'}
          </span>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
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
          {row?.isActive ? (
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
          ) : null}

          <MenuItem onClick={() => navigate(`${paths.dashboard.category.email.add}?id=${row._id}`)}>
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
          <Button variant="contained" color="error">
            Delete
          </Button>
        }
      />
    </>
  );
}
