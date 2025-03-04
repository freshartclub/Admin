import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddtechnicCategory } from 'src/sections/AddTechnicCategory';
// ----------------------------------------------------------------------

const metadata = { title: `Add Technic - ${CONFIG.site.name}` };

export default function AddTechnic() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddtechnicCategory/>
      </DashboardContent>
    </>
  );
}
