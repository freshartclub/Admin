import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { useGetOrderDetail } from '../http/useGetOrderDetail';
import { OrderDetailsHistory } from '../order-details-history';
import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { imgUrl } from 'src/utils/BaseUrls';

// ----------------------------------------------------------------------

export function OrderDetailsView() {
  const { data: order, isLoading } = useGetOrderDetail();

  const handleChangeStatus = (value: string) => {};
  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.list}
        orderNumber={order?.orderId}
        createdAt={order?.createdAt}
        status={order?.status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Grid container spacing={3} border={'1px solid #F0F1F3'} borderRadius={'15px'}>
          <Grid xs={12} md={8}>
            <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
              <OrderDetailsItems
                items={order?.items}
                url={imgUrl}
                taxes={order?.tax}
                type={order?.type}
                shipping={order?.shipping}
                discount={order?.discount}
                subtotal={order?.subTotal}
                totalAmount={order?.total}
              />

              <OrderDetailsHistory history={order} />
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <OrderDetailsInfo
              url={imgUrl}
              customer={order?.user}
              delivery={order?.delivery}
              payment={order?.payment}
              shippingAddress={
                order?.shippingAddress ? order?.shippingAddress : order?.billingAddress
              }
            />
          </Grid>
        </Grid>
      )}
    </DashboardContent>
  );
}
