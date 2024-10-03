import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';



// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.site.name}` };

export default function AddDisiline() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <h1 className='text-black'>this is discipline list page</h1>
    </>
  );
}
