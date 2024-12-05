import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { AllArtist } from 'src/sections/Artistlist/view/allArtistList';

// ----------------------------------------------------------------------

const metadata = { title: `All Artist List - ${CONFIG.site.name}` };

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
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'All Artist List​', href: paths.dashboard.artist.allArtist },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
          action={
            <div className='flex gap-2 items-center'>
              <RouterLink href={`${paths.dashboard.artist.createArtist}`}>
                <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[9rem]">
                  <Iconify icon="mingcute:add-line" /> Create Artist
                </span>
              </RouterLink>
              <RouterLink href={`#`}>
                <span className="bg-green-600 text-white rounded-md flex items-center px-2 py-3 gap-1">
                  <Iconify icon="mingcute:add-line" /> Export CSV
                </span>
              </RouterLink>
            </div>
          }
        />
        <AllArtist />
      </DashboardContent>
    </>
  );
}
