import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { PaymentView } from 'src/sections/payment/view';

const metadata = { title: `Payment - ${CONFIG.site.name}` };

export default function StyleList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PaymentView />
    </DashboardContent>
  );
}
