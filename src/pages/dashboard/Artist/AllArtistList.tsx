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


import { ListArtists } from 'src/sections/Artistlist';
import { AllArtist } from 'src/sections/Artistlist/view/allArtistList';
import { Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';



 
// ----------------------------------------------------------------------


const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

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
          { name: 'Dashboard', href: paths.dashboard.root},
          { name: 'All Artist List​', href: paths.dashboard.artist.allArtist },
        //   { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
            <Button
            href={`${paths.dashboard.artist.createArtist}`}
            startIcon={<Iconify icon="mingcute:add-line" />}
            variant="contained"
          >
            Create Artist

            
          </Button>
        }
      />
       <AllArtist/>
      </DashboardContent>
    </>
  );
}