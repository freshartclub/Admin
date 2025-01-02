import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { ThemeListCategory } from 'src/sections/ThemeListCategory';

// ----------------------------------------------------------------------

const metadata = { title: `Theme List - ${CONFIG.site.name}` };

export default function ThemeList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ThemeListCategory />
    </DashboardContent>
  );
}
