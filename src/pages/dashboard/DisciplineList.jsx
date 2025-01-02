import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { DiscipleListCategory } from 'src/sections/DisciplineListCategory';

// ----------------------------------------------------------------------

const metadata = { title: `Discipline List - ${CONFIG.site.name}` };

export default function AddDisiline() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DiscipleListCategory />
    </DashboardContent>
  );
}
