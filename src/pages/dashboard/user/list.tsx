import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { UserList } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User list - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <UserList />
    </DashboardContent>
  );
}
