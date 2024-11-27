import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { ArtworkAdd } from 'src/sections/ArtworkAdd';

// ----------------------------------------------------------------------

const metadata = { title: `Add Artwork - ${CONFIG.site.name}` };

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
            { name: 'Dashboard', href: paths.dashboard.artwork.Root },
            { name: 'Add Artwork​', href: paths.dashboard.artwork.addArtwork },
          ]}
          sx={{ mb: 3 }}
        />
        <ArtworkAdd />
      </DashboardContent>
    </>
  );
}
