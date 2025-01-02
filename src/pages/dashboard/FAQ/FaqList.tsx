import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { FaqListView } from 'src/sections/FAQS/Faq-list-view';
// ----------------------------------------------------------------------

const metadata = { title: `Faq List - ${CONFIG.site.name}` };

export default function FaqList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FaqListView />
    </DashboardContent>
  );
}
