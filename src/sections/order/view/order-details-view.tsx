import type { IOrderItem } from 'src/types/order';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { paths } from 'src/routes/paths';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';
import { useGetOrderDetail } from '../http/useGetOrderDetail';

// ----------------------------------------------------------------------

export function OrderDetailsView() {
  const { data: order, isLoading } = useGetOrderDetail();
  const [status, setStatus] = useState(order?.status);

  const handleChangeStatus = (value: string) => {};
  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={
          order?.data?.orderType === 'subscription'
            ? paths.dashboard.order.subscribe
            : paths.dashboard.order.purchese
        }
        orderNumber={order?.data?.orderID}
        createdAt={order?.data?.createdAt}
        status={order?.data?.status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3} border={'1px solid #F0F1F3'} borderRadius={'15px'}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={order?.data?.items}
              url={order?.url}
              taxes={order?.data?.tax}
              shipping={order?.data?.shipping}
              discount={order?.data?.discount}
              subtotal={order?.data?.subTotal}
              totalAmount={order?.data?.subTotal}
            />

            <OrderDetailsHistory history={order?.data} />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            url={order?.url}
            customer={order?.data?.user}
            delivery={order?.data?.delivery}
            payment={order?.data?.payment}
            shippingAddress={order?.data?.shippingAddress}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
