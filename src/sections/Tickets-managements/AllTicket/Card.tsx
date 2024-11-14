import { paths } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { fDate } from 'src/utils/format-time';

export function TicketCartd({ data }) {
  const navigate = useNavigate();

  const hendleTicketDetail = (data: any) => {
    navigate(`${paths.dashboard.tickets.singleList}?id=${data?._id}`, { state: { data } });
  };

  return (
    <div className="p-5 border rounded-md mb-4">
      <div className="flex justify-between gap-4 pb-5">
        <div className="flex gap-4">
          <div
            className={`w-[1.5rem] h-[1.5rem] rounded-full ${data?.status === 'Created' ? 'bg-[#F8A534]' : data?.status === 'Dispatched' ? 'bg-[#3B8AFF]' : data.Status === 'Technical Finish' ? 'bg-[#8E33FF]' : data.Status === 'In progress' ? 'bg-[#FFAB00]' : 'bg-[#54C104]'}`}
          ></div>
          <h2 className="text-[16px] text-black font-bold">{data?.ticketId}</h2>
        </div>
        <div>
          <p className="text-[#84818A] text-[14px] font-semibold">
            Posted at - {fDate(data.createdAt)}
          </p>
        </div>
      </div>
      <h4 className="text-black text-[14px] font-semibold pb-2">{data.subject}</h4>
      <p className="text-[#84818A] text-[14px] font-semibold whitespace-nowrap pb-3">
        {data.message}
      </p>
      <hr />
      <div className="flex gap-4 py-1 items-center justify-between">
        <div className="flex gap-4 pt-3 items-center">
          <img src={data?.image} alt="user Image" className="w-[2rem] h-[2rem] rounded-full" />
          <span className="text-[#84818A] text-[14px] font-semibold">
            {data.artistName} {data?.artistSurname1} {data?.artistSurname2}
          </span>
        </div>

        <span
          className="text-[#84818A] text-[14px] font-semibold border-b pb-1 hover:cursor-pointer"
          onClick={() => {
            hendleTicketDetail(data);
          }}
        >
          Open Ticket
        </span>
      </div>
    </div>
  );
}
