import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { AllArtist } from 'src/sections/Artistlist/view/allArtistList';

// ----------------------------------------------------------------------

const metadata = { title: `All Artist List - ${CONFIG.site.name}` };

export default function allArtistList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <CustomBreadcrumbs
          heading="All Artist List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'All Artist List​', href: paths.dashboard.artist.allArtist },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <AllArtist />
      </DashboardContent>
    </>
  );
}
