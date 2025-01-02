import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddPlanForm } from 'src/sections/Subscription-Plans/AddPlan';
// ----------------------------------------------------------------------

const metadata = { title: `Add Subscription Plan - ${CONFIG.site.name}` };

export default function StyleList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddPlanForm />
    </DashboardContent>
  );
}
