import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { TicketsListView } from 'src/sections/Tickets-managements/AllTicket/All-Tickets-List-View';

// ----------------------------------------------------------------------

const metadata = { title: `Ticket List - ${CONFIG.site.name}` };

export default function StyleList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TicketsListView />
    </DashboardContent>
  );
}
