import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { _ecommerceSalesOverview } from 'src/_mock';
import { MotivationIllustration } from 'src/assets/illustrations';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAppSelector } from 'src/store/typedReduxHooks';
import { EcommerceCurrentBalance } from '../ecommerce-current-balance';
import { EcommerceSaleByGender } from '../ecommerce-sale-by-gender';
import { EcommerceSalesOverview } from '../ecommerce-sales-overview';
import { EcommerceWelcome } from '../ecommerce-welcome';
import { EcommerceWidgetSummary } from '../ecommerce-widget-summary';
import { EcommerceYearlySales } from '../ecommerce-yearly-sales';

// ----------------------------------------------------------------------

export function OverviewEcommerceView() {
  const user = useAppSelector((state) => state.user.user);

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid>
          <EcommerceWelcome
            title={`Congratulations 🎉  \n ${user?.firstName} ${user?.lastName}!`}
            description="Best seller of the month you have done 57.6% more sales today."
            img={<MotivationIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Product sold"
            percent={2.6}
            total={765}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Total balance"
            percent={-0.1}
            total={18765}
            chart={{
              colors: [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Sales profit"
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.vars.palette.error.light, theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceSaleByGender
            title="Sale by gender"
            total={2324}
            chart={{
              series: [
                { label: 'Mens', value: 25 },
                { label: 'Womens', value: 50 },
                { label: 'Kids', value: 75 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceYearlySales
            title="Yearly sales"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  name: '2022',
                  data: [
                    {
                      name: 'Total income',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'Total expenses',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  name: '2023',
                  data: [
                    {
                      name: 'Total income',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Total expenses',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceSalesOverview title="Sales overview" data={_ecommerceSalesOverview} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceCurrentBalance
            title="Current balance"
            earning={25500}
            refunded={1600}
            orderTotal={287650}
            currentBalance={187650}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
