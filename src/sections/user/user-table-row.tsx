import { Chip, Divider, Modal, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useBoolean } from 'src/hooks/use-boolean';
import { imgUrl } from 'src/utils/BaseUrls';
import { fDate } from 'src/utils/format-time';
import { useGetUserNotification } from './http/useGetUserNotification';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import { useGetUserSubscription } from './http/useGetUserSubscription';

// ----------------------------------------------------------------------

type Props = {
  row: any;
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

const SubscriptionCard = ({ sub, isActive = false, inactive = false, onManage }) => {
  return (
    <div
      className={`rounded-lg p-4 mb-3 border ${
        isActive
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : inactive
            ? 'border-gray-300 bg-gray-50 dark:bg-gray-800'
            : 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src={`${imgUrl}/users/${sub.planImg}`}
            alt={sub?.planName}
            className="w-16 h-16 object-cover rounded-md"
          />
        </div>

        <div className="flex-1">
          <div className="flex relative justify-between items-start">
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {sub.planName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plan {sub.planGrp} • {sub.type === 'monthly' ? 'Monthly' : 'Yearly'}
              </Typography>
            </div>

            <div className="flex absolute right-0 items-center gap-2">
              <Chip
                label={isActive ? 'Current Active' : inactive ? 'Inactive' : 'Available'}
                size="small"
                color={isActive ? 'info' : inactive ? 'default' : 'primary'}
              />
              {!inactive && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onManage}
                  className="whitespace-nowrap !bg-gray-200 hover:!bg-gray-300"
                  startIcon={<Iconify icon="uil:setting" />}
                >
                  {isActive ? 'Manage Plan' : 'Activate Plan'}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <Typography variant="caption" color="text.secondary">
                Start Date
              </Typography>
              <Typography variant="body2">{fDate(sub.start_date)}</Typography>
            </div>

            <div>
              <Typography variant="caption" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body2">{fDate(sub.createdAt)}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function UserTableRow({ row }: Props) {
  const [viewHistory, setViewHistory] = useState(false);
  const [viewSubscription, setViewSubscription] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useGetUserNotification(row?._id, viewHistory);
  const { data: subData, isLoading: subLoading } = useGetUserSubscription(
    row?._id,
    viewSubscription
  );

  const confirm = useBoolean();
  const popover = usePopover();

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  const viewDetailsModal = (
    <Modal
      open={viewHistory}
      onClose={() => setViewHistory(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 1 }} component="h2">
          User Notification History
        </Typography>
        <Divider />
        <div className="mt-2 flex flex-col gap-2 h-[60vh] overflow-y-scroll max-h-[60vh]">
          {isLoading ? (
            <LoadingScreen />
          ) : data && data?.notifications && data?.notifications.length ? (
            data?.notifications.map((item, i: number) => (
              <div key={i} className="rounded border p-2">
                <p className="flex justify-between">
                  <span>{item?.subject}</span> <span>{fDate(item?.createdAt)}</span>
                </p>
                <p className="mt-1 text-[14px] text-gray-400">{item?.message}</p>
              </div>
            ))
          ) : (
            <p className="text-center pt-10">No History Found</p>
          )}
        </div>
      </Box>
    </Modal>
  );

  const viewSubscriptionModal = (
    <Modal
      open={viewSubscription}
      onClose={() => setViewSubscription(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 1 }} component="h2">
          User Subscription Details
        </Typography>
        <Divider />

        <div className="mt-4 flex flex-col gap-4 h-[60vh] overflow-y-auto">
          {subLoading ? (
            <LoadingScreen />
          ) : subData?.length > 0 ? (
            <>
              {subData.filter((sub) => sub.isCurrActive)?.length > 0 && (
                <div>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}
                  >
                    Current Active Plan
                  </Typography>
                  {subData
                    .filter((sub) => sub.isCurrActive)
                    .map((activeSub, i: number) => (
                      <SubscriptionCard
                        key={i}
                        sub={activeSub}
                        isActive
                        // onManage={() => handleManageSubscription(activeSub)}
                      />
                    ))}
                </div>
              )}
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Other Active Plans
                </Typography>
                {subData.filter((sub) => sub.status === 'active' && !sub.isCurrActive)?.length >
                0 ? (
                  subData
                    .filter((sub) => sub.status === 'active' && !sub.isCurrActive)
                    .map((sub, i: number) => (
                      <SubscriptionCard
                        key={i}
                        sub={sub}
                        // onManage={() => handleManageSubscription(sub)}
                      />
                    ))
                ) : (
                  <Typography className="rounded-lg p-4 border text-center">
                    No Active Subscriptions Found
                  </Typography>
                )}
              </div>

              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Inactive/Expired Plans
                </Typography>
                {subData.filter((sub) => sub.status !== 'active')?.length > 0 ? (
                  subData
                    .filter((sub) => sub.status !== 'active')
                    .map((sub, i: number) => <SubscriptionCard key={i} sub={sub} inactive />)
                ) : (
                  <Typography className="rounded-lg p-4 border text-center">
                    No Inactive/Expired Subscriptions Found
                  </Typography>
                )}
              </div>
            </>
          ) : (
            <Typography className="rounded-lg p-4 border text-center">
              No Subscriptions Found
            </Typography>
          )}
        </div>
      </Box>
    </Modal>
  );

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar
              alt={row?.artistName}
              src={row?.mainImage ? `${imgUrl}/users/${row?.mainImage}` : ''}
            />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" sx={{ cursor: 'pointer' }}>
                {name(row)?.length > 20 ? name(row).slice(0, 20) + '...' : name(row)}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.userId}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone}</TableCell>
        <TableCell className="capitalize" sx={{ whiteSpace: 'nowrap' }}>
          {row.role}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.createdAt)}</TableCell>

        <TableCell>
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
          <MenuItem onClick={() => navigate(`${paths.dashboard.user.profile(row._id)}`)}>
            <Iconify icon="hugeicons:view" />
            View User
          </MenuItem>
          <MenuItem
            onClick={() => {
              setViewHistory(true);
              popover.onClose();
            }}
          >
            <Iconify icon="ic:baseline-history" />
            View History
          </MenuItem>
          <MenuItem
            onClick={() => {
              setViewSubscription(true);
              popover.onClose();
            }}
          >
            <Iconify icon="material-symbols:subscriptions-rounded" />
            View Subscription
          </MenuItem>
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
      {viewDetailsModal}
      {viewSubscriptionModal}
    </>
  );
}
