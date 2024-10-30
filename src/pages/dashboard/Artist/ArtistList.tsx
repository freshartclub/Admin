import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

import { ListArtists } from 'src/sections/Artistlist/view/activeArtist';

// ----------------------------------------------------------------------

const metadata = { title: `Active Artist List - ${CONFIG.site.name}` };

export default function artistList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <CustomBreadcrumbs
          heading="Active Artist List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Active Artist List​', href: paths.dashboard.artist.artistList },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <ListArtists />
      </DashboardContent>
    </>
  );
}
