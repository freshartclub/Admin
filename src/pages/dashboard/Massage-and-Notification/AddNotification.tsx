import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { AddNotificationForm } from 'src/sections/Massages-and-Notifications/AddNotificationForm';
// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function StyleList() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
       
       
       <AddNotificationForm/>
       
      </DashboardContent>
    </>
  );
}
