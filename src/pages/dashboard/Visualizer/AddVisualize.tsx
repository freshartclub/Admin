import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddVisualize } from 'src/sections/Visualize/AddVisualize';

// ----------------------------------------------------------------------

const metadata = { title: `Add Visualize - ${CONFIG.site.name}` };

export default function addVisualize() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddVisualize />
    </DashboardContent>
  );
}
