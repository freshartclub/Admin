import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AllArtist } from 'src/sections/Artistlist/view/allArtistList';

// ----------------------------------------------------------------------

const metadata = { title: `All Artist List - ${CONFIG.site.name}` };

export default function allArtistList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AllArtist />
    </DashboardContent>
  );
}
