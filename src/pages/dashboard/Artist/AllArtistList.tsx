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


import { ListArtists } from 'src/sections/Artistlist/view/activeArtist';
import { AllArtist } from 'src/sections/Artistlist/view/allArtistList';
import { Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Link } from 'react-router-dom';
import { RouterLink } from 'src/routes/components';



 
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
            <RouterLink
            href={`${paths.dashboard.artist.createArtist}`}
            variant="contained"
          >
           <span className="bg-black text-white py-2 px-2 rounded-md flex items-center gap-2">
              {' '}
              <Iconify icon="mingcute:add-line" /> Create Artist
            </span>

            
          </RouterLink>
        }
      />
       <AllArtist/>
      </DashboardContent>
    </>
  );
}