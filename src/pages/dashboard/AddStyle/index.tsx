import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddStyleCategory } from 'src/sections/AddStylecategory';

// ----------------------------------------------------------------------

const metadata = { title: `Add Style - ${CONFIG.site.name}` };

export default function AddStyle() {
  return (
    <>
      <DashboardContent>
        <Helmet>
          <title> {metadata.title}</title>
        </Helmet>

        <AddStyleCategory />
      </DashboardContent>
    </>
  );
}
