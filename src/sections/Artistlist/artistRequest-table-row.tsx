import {
  Avatar,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { ArtistListType } from 'src/types/artist/ArtistDetailType';
import { phoneNo } from 'src/utils/change-case';
import { useBanRequestMutation } from './http/useBanRequestMutation';
import { useRejectRequestMutation } from './http/useRejectRequestMutation';
import { useUnBanRequest } from './http/useUnBanRequest';
import { useUnRejectRequest } from './http/useUnRejectRequest';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { fDate } from 'src/utils/format-time';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistListType;
  url: string;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
  maxHeight: '90vh',
  overflow: 'auto',
};

export function ArtistRequest({ row, url }: Props) {
  const popover = usePopover();
  const navigate = useNavigate();

  const [unBanPopUp, setUnBanPopUp] = useState(false);
  const [unRejectPopUp, setUnRejectPopUp] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);

  const [banPopUp, setBanPopUp] = useState(false);
  const [rejectPopUp, setRejectPopUp] = useState(false);

  const { mutate, isPending } = useRejectRequestMutation(setRejectPopUp);
  const { mutate: banMutate, isPending: banPending } = useBanRequestMutation(setBanPopUp);
  const { mutate: unBanMutate, isPending: unBanPending } = useUnBanRequest(setUnBanPopUp);
  const { mutate: unRejectMutate, isPending: unRejectPending } =
    useUnRejectRequest(setUnRejectPopUp);

  const extisting = row?.userId ? true : false;

  const handleReject = async (id) => {
    mutate(id);
  };
  const handleUnReject = async (id) => {
    unRejectMutate(id);
  };

  const handleBan = async (id) => {
    banMutate(id);
  };

  const handleUnBan = async (id) => {
    unBanMutate(id);
  };

  const handleDocsPreview = () => {
    window.open(`${url}/documents/${row?.documents[0]?.uploadDocs}`, '_blank');
  };

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.nickName) fullName += ' ' + `"${val?.nickName}"`;
    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const viewDetailsModal = (
    <Modal
      open={viewDetails}
      onClose={() => setViewDetails(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Card sx={{ mb: 2 }}>
          <CardHeader title="Artist Request Details" sx={{ mb: 1 }} />
          <Divider />

          <Stack spacing={3} sx={{ p: 3 }}>
            <TextField
              id="outlined-basic"
              label="First Name"
              disabled
              value={row?.artistName}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <TextField
                id="outlined-basic"
                disabled
                value={row?.artistSurname1}
                label="Surname 1"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                id="outlined-basic"
                disabled
                value={row?.artistSurname2}
                label="Surname 2"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <TextField
                id="outlined-basic"
                InputLabelProps={{ shrink: true }}
                disabled
                value={row?.email}
                label="Email"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                InputLabelProps={{ shrink: true }}
                disabled
                value={row?.phone}
                label="Phone Number"
                variant="outlined"
              />
            </Box>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <TextField
                id="outlined-basic"
                InputLabelProps={{ shrink: true }}
                disabled
                value={row?.discipline[0]?.discipline}
                label="Discipline"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                InputLabelProps={{ shrink: true }}
                disabled
                value={row?.discipline[0]?.style.map((style) => style).join(', ')}
                label="Style"
                variant="outlined"
              />
            </Box>
            <TextField
              id="outlined-basic"
              InputLabelProps={{ shrink: true }}
              disabled
              value={row?.country}
              label="Country"
              variant="outlined"
            />
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <TextField
                id="outlined-basic"
                InputLabelProps={{ shrink: true }}
                disabled
                value={row?.zipCode}
                label="Zip Code"
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                InputLabelProps={{ shrink: true }}
                disabled
                value={row?.city}
                label="City"
                variant="outlined"
              />
            </Box>
            <TextField
              id="outlined-basic"
              InputLabelProps={{ shrink: true }}
              disabled
              value={row?.state}
              label="State/Province"
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              InputLabelProps={{ shrink: true }}
              disabled
              value={row?.links[0]?.name}
              label="Social Media Name"
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              InputLabelProps={{ shrink: true }}
              disabled
              value={row?.links[0]?.link}
              label="Social Media URL"
              variant="outlined"
            />
            <Button
              size="small"
              color="primary"
              className="flex justify-end"
              startIcon={<Iconify icon="majesticons:open" />}
              onClick={() => window.open(row?.links[0]?.link, '_blank')}
            >
              Open Link In New Tab
            </Button>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                border: '1px solid #E0E0E0',
                padding: 1,
                borderRadius: 1,
              }}
            >
              <Typography>Attached Document -</Typography>
              <FileThumbnail
                sx={{ cursor: 'pointer' }}
                onClick={handleDocsPreview}
                file={row?.documents[0]?.uploadDocs}
              />
            </Box>
          </Stack>
        </Card>
      </Box>
    </Modal>
  );

  const banDialogBox = (
    <Dialog
      open={banPopUp}
      onClose={() => {
        setBanPopUp(false);
      }}
    >
      <DialogTitle>Ban Artist Request</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are You Sure you want to ban this Artist Request. This action is irreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          disabled={banPending}
          onClick={() => handleBan(row._id)}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {banPending ? 'Loading...' : 'Ban Request'}
        </button>
      </DialogActions>
    </Dialog>
  );

  const unBanDialogBox = (
    <Dialog
      open={unBanPopUp}
      onClose={() => {
        setUnBanPopUp(false);
      }}
    >
      <DialogTitle>Un-Ban Artist Request</DialogTitle>
      <DialogContent>
        <DialogContentText>Are You Sure you want to un-ban this Artist Request.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          disabled={unBanPending}
          onClick={() => handleUnBan(row._id)}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {unBanPending ? 'Loading...' : 'Un-Ban Request'}
        </button>
      </DialogActions>
    </Dialog>
  );

  const rejectDialogBox = (
    <Dialog
      open={rejectPopUp}
      onClose={() => {
        setRejectPopUp(false);
      }}
    >
      <DialogTitle>Reject Artist Request</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are You Sure you want to reject this Artist Request. This action is irreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          disabled={isPending}
          onClick={() => handleReject(row._id)}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {isPending ? 'Loading...' : 'Reject Request'}
        </button>
      </DialogActions>
    </Dialog>
  );

  const unRejectDialogBox = (
    <Dialog
      open={unRejectPopUp}
      onClose={() => {
        setUnRejectPopUp(false);
      }}
    >
      <DialogTitle>Un-Reject Artist Request</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are You Sure you want to un-reject this Artist Request.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          disabled={unRejectPending}
          onClick={() => handleUnReject(row._id)}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {unRejectPending ? 'Loading...' : 'Un-Reject Request'}
        </button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack spacing={1} direction="row" alignItems="center">
            <Avatar alt={row?.artistName} src={`${url}/users/${row?.profile?.mainImage}`} />
            <Stack
              className=" cursor-pointer"
              sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}
            >
              <Link color="inherit" sx={{ cursor: 'pointer' }}>
                {name(row)}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.email}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.80rem' }}>
                {phoneNo(row?.phone)}
              </Box>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.city}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.state?.length > 20 ? `${row?.state?.slice(0, 20)}...` : row?.state}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.country}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <span
            className={`w-fit h-fit flex items-center rounded-2xl px-2 py-1 ${row?.isArtistRequestStatus === 'pending' ? 'bg-[#E7F4EE] text-[#0D894F]' : row?.isArtistRequestStatus === 'ban' ? 'bg-[#FEEDEC] text-[#F04438]' : row?.profileStatus === 'under-review' ? 'bg-[#b1b1b1] text-[#303030]' : 'bg-[#fdf3e5] text-[#f09a38]'}`}
          >
            {row?.profileStatus === 'under-review'
              ? 'Under Review'
              : row?.isArtistRequestStatus.charAt(0).toUpperCase() +
                row?.isArtistRequestStatus.slice(1)}
          </span>
        </TableCell>

        <TableCell sx={{ alignContent: 'center' }}>
          <span onClick={handleDocsPreview} className="cursor-pointer">
            <Iconify icon="mdi:eye-outline" />
          </span>
        </TableCell>
        {row?.referralCode !== 'null' ? (
          <TableCell
            sx={{
              whiteSpace: 'nowrap',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <>
              <span>Yes</span>
              <span className="bg-black text-white text-[12px] px-2 rounded-full">
                {row?.referralCode}
              </span>
            </>
          </TableCell>
        ) : (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>No</TableCell>
        )}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.isArtistRequestStatus === 'pending' ? (
            <RouterLink
              href={`${paths.dashboard.artist.createArtist}?id=${row._id}&extisting=${extisting}`}
            >
              <span className="bg-black text-white py-2 px-2 rounded-md flex items-center gap-2">
                <Iconify icon="mingcute:add-line" /> Create Artist
              </span>
            </RouterLink>
          ) : (
            'N/A'
          )}
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
        <MenuItem
          onClick={() => {
            popover.onClose();
            setViewDetails(true);
          }}
        >
          <Iconify icon="mdi:eye-outline" /> View Details
        </MenuItem>
        {row?.profileStatus === 'under-review' ? (
          <MenuList>
            <MenuItem
              onClick={() => navigate(`${paths.dashboard.artist.reviewArtist}?id=${row._id}`)}
            >
              <Iconify icon="line-md:circle-to-confirm-circle-transition" />
              Review Details
            </MenuItem>
          </MenuList>
        ) : (
          <MenuList>
            {row?.isArtistRequestStatus === 'rejected' ? (
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  setUnRejectPopUp(true);
                }}
              >
                <Iconify icon="fluent-color:approvals-app-24" />
                Un-Reject
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  setRejectPopUp(true);
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
                Reject Request
              </MenuItem>
            )}
            {row?.isArtistRequestStatus === 'ban' ? (
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  setUnBanPopUp(true);
                }}
              >
                <Iconify icon="jam:refresh-reverse" />
                Un-Ban
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  setBanPopUp(true);
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="mdi:ban" />
                Ban Request
              </MenuItem>
            )}
          </MenuList>
        )}
      </CustomPopover>
      {banDialogBox}
      {rejectDialogBox}
      {unBanDialogBox}
      {unRejectDialogBox}
      {viewDetailsModal}
    </>
  );
}
