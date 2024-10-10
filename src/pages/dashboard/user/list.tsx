import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

import { UserList, UserListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
    <DashboardContent>

      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="User List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root},
          { name: 'User List​', href: paths.dashboard.user.list },
        
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserList/>
    </DashboardContent>
      
    </>
  );
}
