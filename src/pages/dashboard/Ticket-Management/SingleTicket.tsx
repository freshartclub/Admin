import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
// ----------------------------------------------------------------------
import { TicketDetailView } from 'src/sections/Tickets-managements/TicketDetail';
const metadata = { title: `Ticket Details - ${CONFIG.site.name}` };

export default function TicketDescription() {
  const location = useLocation();
  const { data } = location.state;
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TicketDetailView ticket={data} />
    </DashboardContent>
  );
}
