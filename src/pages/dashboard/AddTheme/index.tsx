import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddThemeCategory } from 'src/sections/AddThemeCategory';
// ----------------------------------------------------------------------

const metadata = { title: `Add Theme - ${CONFIG.site.name}` };

export default function AddTheme() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddThemeCategory/>
      </DashboardContent>
    </>
  );
}
