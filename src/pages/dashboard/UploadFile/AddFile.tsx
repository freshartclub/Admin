import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import AddFile from 'src/sections/UploadJSONFile/AddFile';
// ----------------------------------------------------------------------

const metadata = { title: `Add File - ${CONFIG.site.name}` };

export default function TechnicList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddFile />
    </DashboardContent>
  );
}
