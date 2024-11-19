import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddPicklist } from 'src/sections/Picklists/AddPicklist';
// ----------------------------------------------------------------------

const metadata = { title: `Add Picklist - ${CONFIG.site.name}` };

export default function AddPicklistt() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <AddPicklist />
      </DashboardContent>
    </>
  );
}
