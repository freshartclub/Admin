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
import useDeleteCarousel from './http/useDeleteCarousel';
import { useState } from 'react';
import useActivateCarousel from './http/useActivateCarousel';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistDisciplineType;
};

export function CarouselListRow({ row }: Props) {
  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteCarousel(row._id);
  const { mutate: activateMutate } = useActivateCarousel(row._id);

  const handleDelete = () => {
    mutate();
    confirm.onFalse();
  };

  const handleActivate = () => {
    activateMutate();
    confirm.onFalse();
  };

  const confirm = useBoolean();
  const popover = usePopover();

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
  });

  const handleOpenConfirm = (type) => {
    setConfirmDialog({ open: true, type });
  };

  const handleAction = () => {
    if (confirmDialog.type === 'delete') {
      handleDelete();
    } else if (confirmDialog.type === 'activate') {
      handleActivate();
    }
    setConfirmDialog({ open: false, type: null });
    popover.onClose();
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.type}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.title || 'N/A'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.subtitle || 'N/A'}</TableCell>
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
          {row?.isDeleted ? (
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                handleOpenConfirm('activate');
              }}
            >
              <Iconify icon="emojione:white-heavy-check-mark" />
              Activate
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                handleOpenConfirm('delete');
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          )}

          <MenuItem
            onClick={() => navigate(`${paths.dashboard.customise.carousel.add}?id=${row._id}`)}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: null })}
        title={confirmDialog.type === 'delete' ? 'Delete' : 'Activate'}
        content={`Are you sure you want to ${confirmDialog.type === 'delete' ? 'delete' : 'activate'}?`}
        action={
          <Button
            variant="contained"
            color={confirmDialog.type === 'delete' ? 'error' : 'primary'}
            onClick={handleAction}
            disabled={isPending}
          >
            {isPending
              ? confirmDialog.type === 'delete'
                ? 'Deleting...'
                : 'Activating...'
              : confirmDialog.type === 'delete'
                ? 'Delete'
                : 'Activate'}
          </Button>
        }
      />
    </>
  );
}
