
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';


import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { ArtistsPendingRequest } from 'src/sections/Artistlist/view/artistPendingRequest';






 
// ----------------------------------------------------------------------


const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function artistPendingList() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Artist Pending Request"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root},
          { name: 'Artist Pending Request​', href: paths.dashboard.artist.artistPendingRequest },
        //   { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ArtistsPendingRequest/>
      </DashboardContent>
    </>
  );
}