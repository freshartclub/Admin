import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { AddCatalogForm } from 'src/sections/Catalogs/AddCatalog';
// ----------------------------------------------------------------------

const metadata = { title: `Add Catalog - ${CONFIG.site.name}` };

export default function  AddCatalog() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddCatalogForm/>
      
      </DashboardContent>
    </>
  );    
}
