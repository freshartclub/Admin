import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { OrderPurcheseView } from 'src/sections/order/view/orderpurchese';

// ----------------------------------------------------------------------

const metadata = { title: `Purchase Order list - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderPurcheseView />
    </>
  );
}
