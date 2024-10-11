import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { AddFaqForm } from 'src/sections/FAQS/AddFaqForm';
 
// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function AddMediaSupport() {
  const navigate = useNavigate()
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      
       <AddFaqForm/>
       
      </DashboardContent>
    </>
  );
}
