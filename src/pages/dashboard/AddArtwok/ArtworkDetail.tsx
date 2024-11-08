import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { ArtworkDetailView } from 'src/sections/Artwork-details-view';
// ----------------------------------------------------------------------

const metadata = { title: `Artwork Preview - ${CONFIG.site.name}` };

export default function ArtworkList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <ArtworkDetailView />
      </DashboardContent>
    </>
  );
}
