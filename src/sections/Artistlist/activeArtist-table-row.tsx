import { Dialog, DialogActions, IconButton, Link } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

import { DialogContent, DialogContentText, DialogTitle, MenuItem, MenuList } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { ArtistListType } from 'src/types/artist/ArtistDetailType';
import { phoneNo } from 'src/utils/change-case';
import { fDate } from 'src/utils/format-time';
import { useChnagePassword } from './http/useChnagePassword';
import { useSuspendArtistMutation } from './http/useSuspendArtistMutation';
import lang from '../artist/addArtist/lang.json';

// ----------------------------------------------------------------------

type Props = {
  row: ArtistListType;
  url: string;
};

export function ListArtist({ row, url }: Props) {
  const popover = usePopover();
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
    const language = row?.language || 'Spanish';
    const selectedLang = lang.find((item) => item.name === language);

    const newData = {
      id: row._id,
      selectedLang: selectedLang?.code || 'ES',
    };

    mutate(newData);
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

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.nickName) fullName += ' ' + `"${val?.nickName}"`;
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
      <DialogTitle>Suspend Artist</DialogTitle>
      <DialogContent>
        <DialogContentText>Are You Sure you want to suspend this Artist?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          disabled={isPending}
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
      <TableRow hover>
        <TableCell>
          <Stack spacing={1} direction="row" alignItems="center">
            <Avatar alt={row?.artistName} src={`${url}/users/${row?.profile?.mainImage}`} />
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                color="inherit"
                onClick={() => navigate(`${paths.dashboard.artist.addArtist}?id=${row?._id}`)}
                sx={{ cursor: 'pointer' }}
              >
                {name(row)}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row?.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.artistId}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNo(row?.phone)}</TableCell>
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
      {dialogBox}
      {chnagePasswordDialogBox}
    </>
  );
}
