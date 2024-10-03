import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { AddCreadentialForm } from 'src/sections/AddCreadentialForm';


 
// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function AddMediaSupport() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Add"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Add Credentials and Insignias Area​', href: paths.dashboard.creadentialsAndInsigniasArea.root },
        //   { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
         <AddCreadentialForm/>
      </DashboardContent>
    </>
  );
}
