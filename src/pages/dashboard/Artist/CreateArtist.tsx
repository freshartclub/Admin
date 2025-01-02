import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { CreateArtistForm } from 'src/sections/Artistlist/createArtitstForm';

// ----------------------------------------------------------------------

const metadata = { title: `Create Artist - ${CONFIG.site.name}` };

export default function artistList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <CustomBreadcrumbs
          heading="Create A New Artist"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Create Artist', href: paths.dashboard.artist.createArtist },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <CreateArtistForm />
      </DashboardContent>
    </>
  );
}
