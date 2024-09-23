import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useAppSelector } from 'src/store/typedReduxHooks';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();

  const pathname = usePathname();

  const isAuthorized = useAppSelector((state) => state.user.isAuthorized);
  const searchParams = useSearchParams();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const checkPermissions = async (): Promise<void> => {
    console.log();

    if (!isAuthorized) {
      const { method } = CONFIG.auth;

      const signInPath = {
        jwt: paths.auth.jwt.signIn,
        auth0: paths.auth.auth0.signIn,
        amplify: paths.auth.amplify.signIn,
        firebase: paths.auth.firebase.signIn,
        supabase: paths.auth.supabase.signIn,
      }[method];

      const href = `${signInPath}?${createQueryString('returnTo', pathname)}`;

      router.replace(paths.auth.jwt.signIn);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
