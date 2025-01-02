import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddFaqForm } from 'src/sections/FAQS/AddFaqForm';

// ----------------------------------------------------------------------

const metadata = { title: `Add Faq - ${CONFIG.site.name}` };

export default function AddFaq() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddFaqForm />
    </DashboardContent>
  );
}
