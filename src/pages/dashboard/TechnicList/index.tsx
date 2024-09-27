import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { BlankView } from 'src/sections/blank/view';

import { TechnicListCategory } from 'src/sections/TechnicListCategory';
// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function TechnicList() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TechnicListCategory/>
      </DashboardContent>
    </>
  );
}
