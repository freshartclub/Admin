import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { SuspendedArtist } from 'src/sections/Artistlist/view/suspendedArtistList';

// ----------------------------------------------------------------------

const metadata = { title: `Suspended Artist List - ${CONFIG.site.name}` };

export default function suspendedArtistList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <CustomBreadcrumbs
          heading="Suspended Artist List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Suspended List​', href: paths.dashboard.artist.suspendList },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <SuspendedArtist />
      </DashboardContent>
    </>
  );
}
