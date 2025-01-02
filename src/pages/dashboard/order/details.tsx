import { Helmet } from 'react-helmet-async';

import { useSearchParams } from 'src/routes/hooks';
import { _orders } from 'src/_mock/_order';
import { CONFIG } from 'src/config-global';
import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

const metadata = { title: `Order details - ${CONFIG.site.name}` };

export default function Page() {
  const id = useSearchParams()?.get('id') as string;

  const currentOrder = _orders.find((order) => order.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderDetailsView order={currentOrder} />
    </>
  );
}
