import { setup } from 'src/utils/axios';

import useCheckIsAuthorized from 'src/http/auth/useGetAuhtorizedUser';

import { LoadingScreen } from 'src/components/loading-screen';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  setup();

  // const { isLoading } = useCheckIsAuthorized();

  // if (isLoading) return <LoadingScreen />;
  return children;
}
