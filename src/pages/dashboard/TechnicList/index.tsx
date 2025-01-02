import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { TechnicListCategory } from 'src/sections/TechnicListCategory';
// ----------------------------------------------------------------------

const metadata = { title: `Technic List - ${CONFIG.site.name}` };

export default function TechnicList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TechnicListCategory />
    </DashboardContent>
  );
}
