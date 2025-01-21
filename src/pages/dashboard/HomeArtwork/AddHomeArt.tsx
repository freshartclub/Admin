import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddHomeArtwork } from 'src/sections/HomeArtworks/AddHomeArtwork';

// ----------------------------------------------------------------------

const metadata = { title: `Add Home Artwork - ${CONFIG.site.name}` };

export default function HomeArtList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddHomeArtwork />
    </DashboardContent>
  );
}
