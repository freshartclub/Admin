import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { ArtistsRequest } from 'src/sections/Artistlist/view/artistRequest';

// ----------------------------------------------------------------------

const metadata = { title: `Artist Request - ${CONFIG.site.name}` };

export default function artistList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <CustomBreadcrumbs
          heading="Artist Request"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Artist Request​', href: paths.dashboard.artist.artistRequest },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <ArtistsRequest />
      </DashboardContent>
    </>
  );
}
