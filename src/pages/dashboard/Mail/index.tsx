import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';


import { MailView } from 'src/sections/mail/view';
 
// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function AddMediaSupport() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
     
        <MailView/>
      </DashboardContent>
    </>
  );
}
