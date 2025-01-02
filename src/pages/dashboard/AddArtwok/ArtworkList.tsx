import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { ArtworkListView } from 'src/sections/Artwork-List';
// ----------------------------------------------------------------------

const metadata = { title: `Artwork List - ${CONFIG.site.name}` };

export default function  ArtworkList() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ArtworkListView/>
      
      </DashboardContent>
    </>
  );    
}
