import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { KbListView } from 'src/sections/KBS/KbListView';
// ----------------------------------------------------------------------

const metadata = { title: `Kb List - ${CONFIG.site.name}` };

export default function KbList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <KbListView />
    </DashboardContent>
  );
}
