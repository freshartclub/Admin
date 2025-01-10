import { paths } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { fDate, fTime } from 'src/utils/format-time';
import { Avatar, Card, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import { Box } from '@mui/material';
import { Link } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function TicketCartd({ url, data }) {
  const navigate = useNavigate();

  const hendleTicketDetail = (data: any) => {
    navigate(`${paths.dashboard.tickets.singleList}?id=${data?._id}`, { state: { data } });
  };

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.nickName) fullName += ' ' + `"${val?.nickName}"`;
    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

  return (
    <div className="p-5 pb-2 border rounded-md mb-4">
      <div className="flex justify-between gap-4 pb-5">
        <div className="flex gap-4">
          <div
            className={`w-[1.5rem] h-[1.5rem] rounded-full ${data?.status === 'Created' ? 'bg-[#F8A534]' : data?.status === 'Dispatched' ? 'bg-[#3B8AFF]' : data.Status === 'Technical Finish' ? 'bg-[#8E33FF]' : data.Status === 'In progress' ? 'bg-[#FFAB00]' : 'bg-[#54C104]'}`}
          ></div>
          <h2 className="text-[16px] text-black font-bold">{data?.ticketId}</h2>
        </div>
        <div className="ticket-id">
          <p className="text-[#84818A] text-[14px] font-semibold">
            <span>Posted At -</span> {fDate(data.createdAt)} {fTime(data.createdAt)}
          </p>
        </div>
      </div>
      <h4 className="text-black text-[14px] font-semibold pb-2">{data.subject}</h4>
      <p className="text-[#84818A] text-[14px] font-semibold pb-3">
        {(data.message || '').slice(0, 250).concat('...')}
      </p>
      {data?.ticketFeedback ? (
        <Card
          sx={{
            p: 1,
            border: '1px solid #E0E0E0',
            borderRadius: '4px',
            backgroundColor: '#F5F5F5',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <span className="text-[14px] text-[#84818A]">
            User Feedback -{' '}
            <span className="font-semibold text-[#000000]">
              {data?.ticketFeedback?.isLiked ? 'Helpfull' : 'Not Helpfull'}{' '}
              {data?.ticketFeedback?.isLiked ? '👍' : '👎'}
            </span>
          </span>
          <span className="text-[14px] text-[#84818A]">
            User Comment -{' '}
            <span className="font-semibold text-[#000000]">
              {data?.ticketFeedback?.message ? data?.ticketFeedback?.message : 'N/A'}
            </span>
          </span>
        </Card>
      ) : (
        <hr />
      )}
      <div className="ticket-box flex gap-4 pt-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar alt={data?.artistName} src={`${url}/users/${data?.mainImage}`} />
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Link color="inherit" sx={{ cursor: 'pointer' }}>
              {name(data)}
            </Link>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {data?.email}
            </Box>
          </Stack>
        </div>

        <span
          onClick={() => hendleTicketDetail(data)}
          className="bg-black cursor-pointer text-white rounded-md flex items-center px-2.5 py-2 gap-2"
        >
          <Iconify icon="el:eye-open" /> <span>Open Ticket</span>
        </span>
      </div>
    </div>
  );
}
