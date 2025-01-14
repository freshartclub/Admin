import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import AddCircle from 'src/sections/Circle/AddCircle';

const metadata = { title: `Add Circle | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddCircle />
    </DashboardContent>
  );
}
