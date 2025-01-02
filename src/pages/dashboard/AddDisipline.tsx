import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AddDisciline } from 'src/sections/AddDiscipline';
import { DashboardContent } from 'src/layouts/dashboard';
// ----------------------------------------------------------------------

const metadata = { title: `Add Discipline - ${CONFIG.site.name}` };

export default function AddDisiline() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddDisciline />
    </DashboardContent>
  );
}
