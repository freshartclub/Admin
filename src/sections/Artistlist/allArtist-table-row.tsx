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

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
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

export function AllArtistList({ row, url }: Props) {
  const confirm = useBoolean();
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
    setShowPop(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    const language = row?.language || 'Spanish';
    const selectedLang = lang.find((item) => item.name === language);

    const newData = {
      id: row._id,
      data: {
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        selectedLang: selectedLang?.code || 'ES',
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
      handelEdit: (id: any) => {
        navigate(`${paths.dashboard.artist.addArtist}?id=${id}#activate`);
      },
    });
  }

  if (row?.profileStatus === 'under-review') {
    actionButtons.push({
      icon: 'grommet-icons:validate',
      name: 'Pending Validation',
      handelEdit: (id: any) => {
        navigate(`${paths.dashboard.artist.reviewArtist}?id=${id}`);
      },
    });
  }

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

  const calculateDays = (val) => {
    if (!val?.nextRevalidationDate) return;
    const today = new Date();
    const createdAt = new Date(val?.nextRevalidationDate);

    const diffTime = today.getTime() - createdAt.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

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
              <a href={`mailto:${row.email}`}>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {row?.email}
                </Box>
              </a>
              <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.80rem' }}>
                {phoneNo(row?.phone)}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.city}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.state}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.country}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {row?.nextRevalidationDate ? (
            <Stack alignItems="center" sx={{ typography: 'body2', flex: '1 1 auto', gap: 1 }}>
              <span>{fDate(row?.nextRevalidationDate)}</span>

              {calculateDays(row) === 0 ? null : calculateDays(row) > 0 ? (
                <span className="w-fit h-fit bg-[#FEEDEC] text-[#f05438] rounded-2xl text-[12px] px-2">{`${Math.abs(calculateDays(row))} Oudated Days`}</span>
              ) : (
                <span className="w-fit h-fit bg-[#f2feec] text-[#0D894F] rounded-2xl text-[12px] px-2">{`${Math.abs(calculateDays(row))} Days Left`}</span>
              )}
            </Stack>
          ) : (
            'N/A'
          )}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.profileStatus === 'under-review' ? (
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', gap: 1 }}>
              <span
                className={`w-fit h-fit text-[12px] px-2 rounded-2xl ${row?.isActivated ? 'bg-[#E7F4EE] text-[#0D894F]' : 'bg-[#FEEDEC] text-[#F04438]'}`}
              >
                {row?.isActivated ? 'Active' : 'Inactive'}
              </span>
              <span className="w-fit h-fit bg-[#FEEDEC] text-[#f09438] rounded-2xl text-[12px] px-2">
                Pending Approval
              </span>
            </Stack>
          ) : (
            <span
              className={`w-fit h-fit ${row?.isActivated ? 'bg-[#E7F4EE] text-[#0D894F] rounded-2xl px-2 py-1' : 'bg-[#FEEDEC] text-[#F04438] rounded-2xl px-2 py-1'}`}
            >
              {row?.isActivated ? 'Active' : 'Inactive'}
            </span>
          )}
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
      {dialogBox}
      {chnagePasswordDialogBox}
    </>
  );
}
