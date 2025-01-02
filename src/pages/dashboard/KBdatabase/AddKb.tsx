import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddKbForm } from 'src/sections/KBS/AddKbForm';
// ----------------------------------------------------------------------

const metadata = { title: `Add Kb - ${CONFIG.site.name}` };

export default function AddKb() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddKbForm />
    </DashboardContent>
  );
}
