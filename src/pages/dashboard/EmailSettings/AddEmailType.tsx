import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddEmailType } from 'src/sections/EmailSetting/AddEmailType';

const metadata = { title: `Add Email Type - ${CONFIG.site.name}` };

export default function AddEmail() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <AddEmailType />
      </DashboardContent>
    </>
  );
}
