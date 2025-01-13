import type { IInvoice } from 'src/types/invoice';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';
import useDeleteCollection from '../http/useDeleteCollection';
import { useState } from 'react';
import useRestoreCollection from '../http/useRestoreCollection';

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  url: string;
};

export function CollectionTableRow({ row, url }: Props) {
  const confirm = useBoolean();
  const popover = usePopover();
  const [openConfirmRestore, setOpenConfirmRestore] = useState(false);

  const navigate = useNavigate();
  const { mutate, isPending } = useDeleteCollection(row._id);
  const { mutate: mutateRestore, isPending: isPendingRestore } = useRestoreCollection(row._id);

  const tags = (val) => {
    if (!val || val.length === 0) return '';

    if (val.length > 3) {
      return val.slice(0, 3).join(' | ') + '...';
    } else {
      return val.slice(0, 3).join(' | ');
    }
  };

  const deleteCollection = () => {
    mutate();
    confirm.onFalse();
    popover.onClose();
  };

  const restoreCollection = () => {
    mutateRestore();
    setOpenConfirmRestore(false);
    popover.onClose();
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Stack spacing={2} direction="row" alignItems="center">
            {row?.collectionFile.includes('.png') ||
            row?.collectionFile.includes('.jpg') ||
            row?.collectionFile.includes('.jpeg') ||
            row?.collectionFile.includes('.webp') ? (
              <Avatar alt={row.collectionTitle} src={`${url}/users/${row?.collectionFile}`} />
            ) : (
              <Avatar alt={row.collectionTitle} src={row?.collectionName} />
            )}

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.collectionName}
                </Typography>
              }
            />
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{tags(row?.collectionTags)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.status}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.createdBy}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <span
            className={`w-fit h-fit ${!row?.isDeleted ? 'bg-[#E7F4EE] text-[#0D894F] rounded-2xl px-2 py-1' : 'bg-[#FEEDEC] text-[#F04438] rounded-2xl px-2 py-1'}`}
          >
            {!row?.isDeleted ? 'Active' : 'Inactive'}
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
          {row?.isDeleted ? (
            <MenuItem onClick={() => setOpenConfirmRestore(true)} sx={{ color: 'success.main' }}>
              <Iconify icon="system-uicons:reverse" /> Restore
            </MenuItem>
          ) : (
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
          )}

          <MenuItem
            onClick={() =>
              navigate(`${paths.dashboard.artwork.collection_management.add}?id=${row._id}`)
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
        title={`Delete Collection - "${row.collectionName}"`}
        content="Are you sure want to delete this collection?"
        action={
          <Button variant="contained" color="error" onClick={deleteCollection}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />

      <ConfirmDialog
        open={openConfirmRestore}
        onClose={() => setOpenConfirmRestore(false)}
        title={`Restore Collection - "${row.collectionName}"`}
        content="Are you sure you want to restore this collection?"
        action={
          <Button variant="contained" color="success" onClick={restoreCollection}>
            {isPendingRestore ? 'Activating...' : 'Restore'}
          </Button>
        }
      />
    </>
  );
}
