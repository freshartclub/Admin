import type { AddArtistComponentProps } from 'src/types/artist/AddArtistComponentTypes';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { useState } from 'react';
import { useSuspendArtistMutation } from './http/useSuspendArtistMutation';
import { useForm } from 'react-hook-form';
import { useChnagePassword } from './http/useChnagePassword';
import { fDate } from 'src/utils/format-time';
import { phoneNo } from 'src/utils/change-case';

// ----------------------------------------------------------------------

type Props = {
  row: AddArtistComponentProps;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function AllArtistList({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const confirm = useBoolean();
  const popover = usePopover();
  // const password = useBoolean();
  // const quickEdit = useBoolean();
  const [showPop, setShowPop] = useState(false);
  const [showPasswordPop, setShowPasswordPop] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch('newPassword');
  const { mutate, isPending } = useSuspendArtistMutation();
  const { mutate: mutatePassword, isPending: isPendingPassword } =
    useChnagePassword(setShowPasswordPop);

  const handleSuspend = async (id) => {
    mutate(id);
  };

  const onSubmit = handleSubmit(async (data) => {
    const newData = {
      id: row._id,
      data: {
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
    };

    await mutatePassword(newData);
  });

  const actionButtons = [
    {
      icon: 'solar:pen-bold',
      name: 'Edit Details',
      handelEdit: (id: any) => {
        navigate(paths.dashboard.artist.addArtist + '?id=' + id);
      },
    },
    {
      icon: 'hugeicons:view',
      name: 'View',
      handelEdit: (id: any) => {
        navigate(paths.dashboard.artist.addArtist + '?id=' + id + '&view=true');
      },
    },
    {
      icon: 'icon-park-outline:change',
      name: 'Change Password',
      handelEdit: () => {
        setShowPasswordPop(true);
      },
    },
    {
      icon: 'mingcute:warning-fill',
      name: 'Suspend Artist',
      handelEdit: () => {
        setShowPop(true);
      },
    },
  ];

  if (!row?.isActivated) {
    actionButtons.push({
      icon: 'charm:circle-tick',
      name: 'Activate Artist',
      handelEdit: () => {},
    });
  }

  const dialogBox = (
    <Dialog
      open={showPop}
      onClose={() => {
        setShowPop(false);
      }}
    >
      <DialogTitle>Suspend Artist</DialogTitle>
      <DialogContent>
        <DialogContentText>Are You Sure you want to suspend this Artist?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => handleSuspend(row._id)}
          className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
        >
          {isPending ? 'Loading...' : ' Suspend Artist'}
        </button>
      </DialogActions>
    </Dialog>
  );

  const chnagePasswordDialogBox = (
    <Dialog
      sx={{ width: '100vw' }}
      open={showPasswordPop}
      onClose={() => {
        setShowPasswordPop(false);
      }}
    >
      <DialogTitle>
        Change Password - ({row?.artistName} {row?.userId})
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <input
            className=" py-2 border-[1px] border-zinc-500 rounded-lg px-2"
            type="password"
            placeholder="New Password"
            {...register('newPassword', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
            })}
          />
          {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}

          <input
            className=" py-2 border-[1px] border-zinc-500 rounded-lg px-2"
            type="text"
            placeholder="Confirm Password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === newPassword || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </DialogContent>
        <DialogActions>
          <button
            type="submit"
            className="text-white bg-green-600 rounded-lg px-5 py-2 hover:bg-green-700 font-medium"
            disabled={isPending}
          >
            {isPendingPassword ? 'Loading...' : 'Change Password'}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row._id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={1} direction="row" alignItems="center">
            <Avatar alt={row?.uploadImage} src={row?.profile?.mainImage} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row?.artistName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNo(row?.phone)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.address?.city}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.address?.state}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.address?.country}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <span
            className={`w-fit h-fit flex items-center ${row?.isActivated ? 'bg-[#E7F4EE] text-[#0D894F] rounded-2xl px-2 py-1' : 'bg-[#FEEDEC] text-[#F04438] rounded-2xl px-2 py-1'}`}
          >
            {row?.isActivated ? 'Active' : 'Inactive'}
          </span>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row?.createdAt)}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {actionButtons.map((itmes: any, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                itmes.handelEdit(row._id);
              }}
            >
              <Iconify icon={itmes.icon} />
              {itmes.name}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
      {dialogBox}
      {chnagePasswordDialogBox}
    </>
  );
}
