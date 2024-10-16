import { Stack } from '@mui/material';
import { Divider } from '@mui/material';
import { Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable } from 'src/components/table';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { InvoiceAnalytic } from 'src/sections/invoice/invoice-analytic';
import { InvoiceListView } from 'src/sections/invoice/view';

import { ListArtist } from 'src/sections/Artistlist';
import { ArtistsRequest } from 'src/sections/Artistlist/view/artistRequest';
import { CreateArtists } from 'src/sections/Artistlist/view/createArtist';
import { CreateArtistForm } from 'src/sections/Artistlist/createArtitstForm';

// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function artistList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <CustomBreadcrumbs
          heading="Create A New User"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Create User​', href: paths.dashboard.artist.createArtist },
            //   { name: currentUser?.name },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <CreateArtistForm />
      </DashboardContent>
    </>
  );
}
