import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

import { CreateContentForm } from 'src/sections/ContentManagement/CreateContentForm';
 
// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function CreateContent() {
  const navigate = useNavigate()
  return (
    <>
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
     
      <CustomBreadcrumbs
        heading="Create Content"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Content Management', href: paths.dashboard.contentmanagement.Root },
          { name: 'Create', href: paths.dashboard.contentmanagement.create },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      
       <CreateContentForm/>
       
      </DashboardContent>
    </>
  );
}
