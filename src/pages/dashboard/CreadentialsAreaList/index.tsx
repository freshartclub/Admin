import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { CredentialAreaList } from 'src/sections/CredentialList';

// ----------------------------------------------------------------------

const metadata = { title: `Credential & Insignia List - ${CONFIG.site.name}` };

export default function AddMediaSupport() {
  return (
    <DashboardContent>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CredentialAreaList />
    </DashboardContent>
  );
}
