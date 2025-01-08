import { Button } from '@mui/material';
import { Avatar, Card, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

type planProps = { url: string; plan: any };

const PlanCard = ({ url, plan }: planProps) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ py: 2, px: 3, border: '1px solid #e0e0e0', width: '19rem' }}>
      <Stack direction="column">
        <Avatar alt={plan?.planGrp?.catalogName} src={`${url}/users/${plan.planImg}`} />
        <Typography variant="h6">{plan.planGrp?.catalogName}</Typography>
      </Stack>
      <Stack mt={2}>
        <div className="flex gap-1 items-baseline">
          <Typography variant="h4">€{plan.currentPrice}</Typography>
          <span className="text-gray-500">/month</span>
        </div>
        <div className="mt-2">
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
            What you get:
          </Typography>
          <ol className="flex gap-3 flex-col mt-3">
            <li className="flex gap-4 items-center">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.9556 1.90309L6.05063 15.5087L0.0419922 9.5001L1.5004 8.04169L5.95017 12.4915L16.4034 0.544922L17.9556 1.90309Z"
                  fill="#102030"
                />
              </svg>
              Fermentum Venenatis T
            </li>
            <li className="flex gap-4 items-center">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.9556 1.90309L6.05063 15.5087L0.0419922 9.5001L1.5004 8.04169L5.95017 12.4915L16.4034 0.544922L17.9556 1.90309Z"
                  fill="#102030"
                />
              </svg>
              Fermentum Venenatis T
            </li>
            <li className="flex gap-4 items-center">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.9556 1.90309L6.05063 15.5087L0.0419922 9.5001L1.5004 8.04169L5.95017 12.4915L16.4034 0.544922L17.9556 1.90309Z"
                  fill="#102030"
                />
              </svg>
              Fermentum Venenatis T
            </li>
            <li className="flex gap-4 items-center">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.9556 1.90309L6.05063 15.5087L0.0419922 9.5001L1.5004 8.04169L5.95017 12.4915L16.4034 0.544922L17.9556 1.90309Z"
                  fill="#102030"
                />
              </svg>
              Fermentum Venenatis T
            </li>
            <li className="flex gap-4 items-center">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.9556 1.90309L6.05063 15.5087L0.0419922 9.5001L1.5004 8.04169L5.95017 12.4915L16.4034 0.544922L17.9556 1.90309Z"
                  fill="#102030"
                />
              </svg>
              Fermentum Venenatis T
            </li>
          </ol>
        </div>
        <Button
          onClick={() => navigate(`${paths.dashboard.subscriptionplan.add}?id=${plan._id}`)}
          sx={{ mt: 2, borderRadius: '30px' }}
          variant="contained"
          className="w-ful"
        >
          Edit Plan
        </Button>
      </Stack>
    </Card>
  );
};

export default PlanCard;
