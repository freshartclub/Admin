import { Box, Divider, Stack, Typography } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { imgUrl } from 'src/utils/BaseUrls';
import { useGetAllPlans } from './http/useGetAllPlans';
import PlanCard from './PlanCard';

// ----------------------------------------------------------------------

export function PlanList() {
  const { data, isLoading } = useGetAllPlans();

  const result = data
    ? Object.groupBy(data, (item) => {
        return item.planGrp;
      })
    : {};

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
        <Stack spacing={4}>
          {Object.keys(result).length > 0 ? (
            Object.entries(result).map(([groupName, plans], index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ backgroundColor: '#f5f5f5', padding: '0.5rem', borderRadius: '8px' }}
                  component="div"
                  gutterBottom
                >
                  {groupName}
                </Typography>
                <Divider sx={{ mb: 1 }} />

                <Stack
                  direction="row"
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  {plans &&
                    plans.length > 0 &&
                    plans.map((plan, i) => <PlanCard key={i} url={imgUrl} plan={plan} />)}
                </Stack>
              </Box>
            ))
          ) : (
            <Typography>No Plans Found</Typography>
          )}
        </Stack>
      )}
    </>
  );
}
