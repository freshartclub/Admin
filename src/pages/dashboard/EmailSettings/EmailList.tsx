import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddEmailType } from 'src/sections/EmailSetting/AddEmailType';
import { EmailList } from 'src/sections/EmailSetting/AllEmailType';

const metadata = { title: `Email List - ${CONFIG.site.name}` };

export default function AllEmailType() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <EmailList />
      </DashboardContent>
    </>
  );
}
