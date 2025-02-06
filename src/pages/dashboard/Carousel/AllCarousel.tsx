import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { AllCarousel } from 'src/sections/Carousel/AllCarousel';

// ----------------------------------------------------------------------

const metadata = { title: `Carousel List - ${CONFIG.site.name}` };

export default function artistList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AllCarousel />
    </DashboardContent>
  );
}
