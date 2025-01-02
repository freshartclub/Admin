import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddIncidentForm } from 'src/sections/Tickets-managements/IncidentForm-view';
// ----------------------------------------------------------------------

const metadata = { title: `Add Incident - ${CONFIG.site.name}` };

export default function StyleList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddIncidentForm />
    </DashboardContent>
  );
}
