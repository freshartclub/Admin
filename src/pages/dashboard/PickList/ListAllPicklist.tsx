import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { ListAllPicklist } from 'src/sections/Picklists/ListAllPicklist';
// ----------------------------------------------------------------------

const metadata = { title: `All Picklist - ${CONFIG.site.name}` };

export default function AllPickList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ListAllPicklist />
    </DashboardContent>
  );
}
