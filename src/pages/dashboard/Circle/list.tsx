import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { CircleList } from 'src/sections/Circle/CircleList';

// ----------------------------------------------------------------------

const metadata = { title: `Circle list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CircleList />
    </DashboardContent>
  );
}
