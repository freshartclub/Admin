import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

import { ArtworkAdd } from 'src/sections/ArtworkAdd';

 
// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function AddMediaSupport() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Add Artwork"
        links={[
          { name: 'Dashboard', href: paths.dashboard.artwork.Root},
          { name: 'AddArtwork​', href: paths.dashboard.artwork.addArtwork },
        //   { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
         <ArtworkAdd/>
      </DashboardContent>
    </>
  );
}
