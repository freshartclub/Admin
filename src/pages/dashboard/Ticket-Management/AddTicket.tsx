import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddTicket } from 'src/sections/Tickets-managements/AddTicket';
// ----------------------------------------------------------------------

const metadata = { title: `Add Ticket - ${CONFIG.site.name}` };

export default function StyleList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddTicket />
    </DashboardContent>
  );
}
