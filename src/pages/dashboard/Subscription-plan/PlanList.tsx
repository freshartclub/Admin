import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { PlanList } from 'src/sections/Subscription-Plans/PlanList';
// ----------------------------------------------------------------------

const metadata = { title: `Plan List - ${CONFIG.site.name}` };

export default function AllPlans() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PlanList />
    </DashboardContent>
  );
}
