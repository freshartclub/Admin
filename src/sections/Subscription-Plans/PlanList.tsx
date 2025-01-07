import Card from '@mui/material/Card';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import PlanCard from './PlanCard';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetAllPlans } from './http/useGetAllPlans';
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

export function PlanList() {
  const { data, isLoading } = useGetAllPlans();

  return (
    <>
      <CustomBreadcrumbs
        heading="Plan List"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Plan List' }]}
        sx={{ mb: 3 }}
        action={
          <div className="flex justify-end gap-2">
            <RouterLink href={paths.dashboard.subscriptionplan.add}>
              <span className="bg-black text-white rounded-md flex items-center px-2 py-3 gap-2 w-[7rem]">
                <Iconify icon="mingcute:add-line" /> Add Plan
              </span>
            </RouterLink>
            <RouterLink href={`#`}>
              <span className="bg-green-600 text-white rounded-md flex items-center px-2 py-3 gap-1">
                <Iconify icon="mingcute:add-line" /> Export CSV
              </span>
            </RouterLink>
          </div>
        }
      />

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Stack direction="row" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, border: 'none' }}>
          {data?.data && data?.data.length > 0
            ? data?.data.map((plan, i) => <PlanCard key={i} url={data?.url} plan={plan} />)
            : 'No Data Found'}
        </Stack>
      )}
    </>
  );
}
