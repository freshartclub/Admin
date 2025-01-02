import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { MediaSupportListCategory } from 'src/sections/MediaSupportListCategor';
// ----------------------------------------------------------------------

const metadata = { title: `Media Support List - ${CONFIG.site.name}` };

export default function MediaSupportList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MediaSupportListCategory />
    </DashboardContent>
  );
}
