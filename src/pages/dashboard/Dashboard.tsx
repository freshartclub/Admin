import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { OverviewEcommerceView } from 'src/sections/e-commerce/view';
// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewEcommerceView />
    </>
  );
}
