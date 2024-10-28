import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AllIncidentView } from 'src/sections/Tickets-managements/AllIncidentView';

// ----------------------------------------------------------------------

const metadata = { title: `All Incident - ${CONFIG.site.name}` };

export default function StyleList() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <AllIncidentView />
      </DashboardContent>
    </>
  );
}
