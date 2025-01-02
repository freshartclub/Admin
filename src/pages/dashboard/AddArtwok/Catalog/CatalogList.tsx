import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { CatalogListView } from 'src/sections/Catalogs/CatalogList';
// ----------------------------------------------------------------------

const metadata = { title: `Catalog List - ${CONFIG.site.name}` };

export default function  CatalogList() {
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
       
        <CatalogListView/>
      
      </DashboardContent>
    </>
  );    
}
