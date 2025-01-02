import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { AddMediaSupportCategory } from 'src/sections/AddMediaSupportCategory.tsx';
 
// ----------------------------------------------------------------------

const metadata = { title: `Add Media Support - ${CONFIG.site.name}` };

export default function AddMediaSupport() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

       <AddMediaSupportCategory/>
      </DashboardContent>
    </>
  );
}
