import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AllVisualize } from 'src/sections/Visualize/AllVisualize';

// ----------------------------------------------------------------------

const metadata = { title: `Visualize List - ${CONFIG.site.name}` };

export default function visualizeList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AllVisualize />
    </DashboardContent>
  );
}
