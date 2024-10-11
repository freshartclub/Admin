import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { AccountNotifications } from 'src/sections/account/account-notifications';
// ----------------------------------------------------------------------

import { NotificationsAndMessage } from 'src/sections/Massages-and-Notifications/List';

export default function StyleList() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        {/* <title> {metadata.title}</title> */}
      </Helmet>
       
       
       <NotificationsAndMessage/>
      </DashboardContent>
    </>
  );
}
