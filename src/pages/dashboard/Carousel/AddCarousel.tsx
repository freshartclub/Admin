import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import AddCarousel from 'src/sections/Carousel/AddCarousel';

// ----------------------------------------------------------------------

const metadata = { title: `Carousel Add - ${CONFIG.site.name}` };

export default function artistList() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddCarousel />
    </DashboardContent>
  );
}
