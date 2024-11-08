import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { AddCreadentialForm } from 'src/sections/AddCreadentialForm';

// ----------------------------------------------------------------------

const metadata = { title: `Add Insignia - ${CONFIG.site.name}` };

export default function AddMediaSupport() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <CustomBreadcrumbs
          heading="Add Credentials and Insignia"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Add Credentials and Insignia' },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <AddCreadentialForm />
      </DashboardContent>
    </>
  );
}
