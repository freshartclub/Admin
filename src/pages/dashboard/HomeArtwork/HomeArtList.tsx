import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { GetAllHomeArtwork } from 'src/sections/HomeArtworks/GetAllHomeArtwork';

// ----------------------------------------------------------------------

const metadata = { title: `Home Artwork List - ${CONFIG.site.name}` };

export default function HomeArtList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GetAllHomeArtwork />
    </DashboardContent>
  );
}
