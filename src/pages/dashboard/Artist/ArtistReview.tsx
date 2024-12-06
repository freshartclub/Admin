import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { ArtistReview } from 'src/sections/Artistlist/artistReview';

// ----------------------------------------------------------------------

const metadata = { title: `Review Artist Details - ${CONFIG.site.name}` };

export default function artistList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <CustomBreadcrumbs
          heading="Review Artist Updated Details"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Review Artist Updated Details' }]}
          sx={{ mb: 3 }}
        />
        <ArtistReview />
      </DashboardContent>
    </>
  );
}
