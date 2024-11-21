import type { IInvoice } from 'src/types/invoice';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { DialogActions, Tooltip } from '@mui/material';
import { useRemoveArtWorkList } from './http/useRemoveArtWorkList';
import { Dialog } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { useState } from 'react';
import { useValidateartWork } from './http/useValidateArtwork';

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  url: string;
  selected: boolean;
  onSelectRow: () => void;
  onViewRow: () => void;
  onEditRow: () => void;
  onDeleteRow: () => void;
};

export function ArtworkTableRow({
  row,
  url,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();
  const [showPop, setShowPop] = useState(false);
  const [validate, setValidate] = useState(false);

  const popover = usePopover();
  const { mutateAsync, isPending } = useRemoveArtWorkList(row._id);
  const { mutateAsync: validateMuate, isPending: validatePending } = useValidateartWork(row._id);

  const removeArtWorkList = () => {
    mutateAsync().then(() => {
      setShowPop(false);
      popover.onClose();
    });
  };

  const validateArtwork = () => {
    validateMuate().then(() => {
      setValidate(false);
      popover.onClose();
    });
  };

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const dialogBox = (
    <Dialog
      open={showPop}
      onClose={() => {
        setShowPop(false);
      }}
    >
      <DialogTitle>Remove Artwork</DialogTitle>
      <DialogContent>
        <DialogContentText>Are You Sure you want to remove this Art Work?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={removeArtWorkList}
          className="text-white bg-green-400 rounded-lg px-5 py-2 hover:bg-green-500 font-medium"
        >
          {isPending ? 'Removing...' : 'Remove'}
        </button>
      </DialogActions>
    </Dialog>
  );

  const validateDialogBox = (
    <Dialog
      open={validate}
      onClose={() => {
        setValidate(false);
      }}
    >
      <DialogTitle>Validate Artwork</DialogTitle>
      <DialogContent>
        <DialogContentText>You are about to validate this Artwork. Are you sure?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={validateArtwork}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {validatePending ? 'Validating...' : 'Validate'}
        </button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row?.id}`, 'aria-label': `Row checkbox` }}
          />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row?.artworkName} src={`${url}/users/${row?.media?.mainImage}`} />

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row?.artworkName}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={onViewRow}
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                >
                  {row?.artworkTechnic}
                </Link>
              }
            />
          </Stack>
        </TableCell>
        <TableCell>{name(row)}</TableCell>
        <TableCell>{row?.discipline?.artworkDiscipline}</TableCell>
        <TableCell>{row?.artworkSeries}</TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row?.createdAt)}
            secondary={fTime(row?.publishDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'published' && 'success') ||
              (row.status === 'pending' && 'warning') ||
              (row.status === 'rejected' && 'error') ||
              'default'
            }
          >
            {row?.status}
          </Label>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={() => setShowPop(true)}>
            <Iconify icon="ph:key-return-fill" />
            Request Return
          </MenuItem>
          {row?.status === 'published' ? (
            <MenuItem>
              <Iconify icon="ic:outline-published-with-changes" />
              Published
            </MenuItem>
          ) : (
            <MenuItem onClick={() => setValidate(true)}>
              <Iconify icon="grommet-icons:validate" />
              Validate
            </MenuItem>
          )}
          <MenuItem onClick={() => setShowPop(true)}>
            <Iconify icon="line-md:circle-twotone-to-confirm-circle-transition" />
            ReValidate
          </MenuItem>
          <MenuItem onClick={() => setShowPop(true)}>
            <Iconify icon="iconoir:info-empty" />
            Not Available
          </MenuItem>
          <MenuItem onClick={() => setShowPop(true)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {dialogBox}
      {validateDialogBox}
    </>
  );
}
