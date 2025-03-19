import type { IInvoice } from 'src/types/invoice';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { fDate, fTime } from 'src/utils/format-time';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { paths } from 'src/routes/paths';
import { useRemoveArtWorkList } from './http/useRemoveArtWorkList';
import { useValidateartWork } from './http/useValidateArtwork';
import { useMoveToPending } from './http/useMoveToPending';

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  url: string;
};

export function ArtworkTableRow({ row, url }: Props) {
  const navigate = useNavigate();
  const [showPop, setShowPop] = useState(false);
  const [movePending, setMovePending] = useState(false);
  const [validate, setValidate] = useState(false);

  const popover = usePopover();
  const { mutateAsync, isPending } = useRemoveArtWorkList(row._id);
  const { mutateAsync: pendingMutate, isPending: pendingPending } = useMoveToPending(row._id);
  const { mutateAsync: validateMuate, isPending: validatePending } = useValidateartWork(row._id);

  const removeArtWorkList = () => {
    mutateAsync().then(() => {
      setShowPop(false);
      popover.onClose();
    });
  };

  const movePendingArtwork = () => {
    pendingMutate().then(() => {
      setMovePending(false);
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
          className="text-white bg-red-700 rounded-lg px-5 py-2 hover:bg-red-800 font-medium"
        >
          {isPending ? 'Removing...' : 'Remove'}
        </button>
      </DialogActions>
    </Dialog>
  );

  const moveDialogBox = (
    <Dialog
      open={movePending}
      onClose={() => {
        setMovePending(false);
      }}
    >
      <DialogTitle>Move Artwork To Pending</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are You Sure you want to move this Art Work to Pending?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={movePendingArtwork}
          className="text-white bg-orange-700 rounded-lg px-5 py-2 hover:bg-orange-700 font-medium"
        >
          {pendingPending ? 'Move...' : 'Move To Pending'}
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
      <TableRow hover>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row?.artworkName} src={`${url}/users/${row?.media?.mainImage}`} />

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row?.artworkName.length > 17
                    ? row?.artworkName.slice(0, 17) + '...'
                    : row?.artworkName}
                </Typography>
              }
              secondary={
                <Link
                  onClick={() =>
                    navigate(`${paths.dashboard.artwork.artworkDetail}?id=${row?._id}&preview=true`)
                  }
                  noWrap
                  variant="body2"
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                >
                  {row?.artworkId ? row?.artworkId : 'N/A'}
                </Link>
              }
            />
          </Stack>
        </TableCell>
        <TableCell>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {name(row)}
              </Typography>
            }
            secondary={
              <Link noWrap variant="body2" sx={{ color: 'text.disabled', cursor: 'pointer' }}>
                {row?.artistId ? row?.artistId : 'N/A'}
              </Link>
            }
          />
        </TableCell>
        <TableCell>{row?.discipline?.artworkDiscipline}</TableCell>
        <TableCell>{row?.activeTab}</TableCell>
        <TableCell>
          <ListItemText
            primary={fDate(row?.createdAt)}
            secondary={fTime(row?.publishDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>
        <TableCell>{row?.comingSoon ? 'Yes' : 'No'}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'published' && 'success') ||
              (row.status === 'modified' && 'secondary') ||
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
          <MenuItem>
            <Iconify icon="ph:key-return-fill" />
            Request Return
          </MenuItem>
          <MenuItem
            onClick={() =>
              navigate(`${paths.dashboard.artwork.artworkDetail}?id=${row?._id}&preview=true`)
            }
          >
            <Iconify icon="hugeicons:view" />
            View Artwork
          </MenuItem>
          {row?.status === 'rejected' ? null : row?.status === 'draft' ? (
            <MenuItem
              onClick={() => navigate(`${paths.dashboard.artwork.addArtwork}?id=${row?._id}`)}
            >
              <Iconify icon="material-symbols:edit" />
              Edit Artwork
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() =>
                navigate(`${paths.dashboard.artwork.addArtwork}?id=${row?._id}&modify=true`)
              }
            >
              <Iconify icon="ic:outline-published-with-changes" />
              Modify Artwork
            </MenuItem>
          )}

          {row?.status === 'pending' ? (
            <MenuItem onClick={() => setValidate(true)}>
              <Iconify icon="grommet-icons:validate" />
              Validate
            </MenuItem>
          ) : null}

          {row?.status === 'modified' ? (
            <MenuItem onClick={() => navigate(`${paths.dashboard.artwork.reviewArtwork(row._id)}`)}>
              <Iconify icon="grommet-icons:validate" />
              Approve Changes
            </MenuItem>
          ) : null}
          <MenuItem>
            <Iconify icon="iconoir:info-empty" />
            Not Available
          </MenuItem>
          {row?.status === 'rejected' || row?.status === 'draft' ? null : (
            <MenuItem onClick={() => setShowPop(true)} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          )}
          {row?.status === 'rejected' ? (
            <MenuItem onClick={() => setMovePending(true)} sx={{ color: 'warning.main' }}>
              <Iconify icon="grommet-icons:revert" />
              Move to Pending
            </MenuItem>
          ) : null}
        </MenuList>
      </CustomPopover>

      {dialogBox}
      {moveDialogBox}
      {validateDialogBox}
    </>
  );
}
