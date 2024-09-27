import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { AddStyleCategory } from 'src/sections/AddStylecategory';

import { BlankView } from 'src/sections/blank/view';


// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function AddStyle() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

        <AddStyleCategory/>
      </DashboardContent>
    </>
  );
}
