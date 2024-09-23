import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { deleteToken } from 'src/utils/tokenHelper';

import { useAppDispatch } from 'src/store/typedReduxHooks';
import { removeUser, setIsAuthorized } from 'src/store/userSlice/userSlice';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  sx?: SxProps<Theme>;
  onClose?: () => void;
};

export function SignOutButton({ onClose, ...other }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleLogout = useCallback(async () => {
    try {
      dispatch(setIsAuthorized(false));
      dispatch(removeUser());
      deleteToken();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Button fullWidth variant="soft" size="large" color="error" onClick={handleLogout} {...other}>
      Logout
    </Button>
  );
}
