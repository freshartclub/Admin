import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { ArtworkRevies } from 'src/sections/Artwork-List/ArtworkRevies';

// ----------------------------------------------------------------------

const metadata = { title: `Artwork Review - ${CONFIG.site.name}` };

export default function ArtworkList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <CustomBreadcrumbs
          heading="Review Artwork Updated Details"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Review Artwork Updated Details' },
          ]}
          sx={{ mb: 3 }}
        />
        <ArtworkRevies />
      </DashboardContent>
    </>
  );
}
