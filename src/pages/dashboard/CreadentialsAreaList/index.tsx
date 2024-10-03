import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';


import { CredentialAreaList } from 'src/sections/CredentialList';
 
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
     
      {/* <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Credentials and Insignias Area List', href: paths.dashboard.creadentialsAndInsigniasArea.list },
        //   { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      /> */}
      {/* <button className='text-white bg-black rounded-md py-2 px-3 w-fit h-fit'>+ Create Credentials and Insignias Area​</button> */}
     
        <CredentialAreaList/>
      </DashboardContent>
    </>
  );
}
