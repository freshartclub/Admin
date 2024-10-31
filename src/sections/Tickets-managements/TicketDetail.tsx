import { Box, Card, CardHeader, Stack } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { Field, Form } from 'src/components/hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TICKET_TYPE_OPTIONS, TICKET_STATUS_OPTIONS } from 'src/_mock';
import { fDate, fTime } from 'src/utils/format-time';
import useAddReplyMutation from './http/useAddReplyMutation';
import { useGetReplyMutation } from './http/useGetReplyMutation';

export type NewPostSchemaType = zod.infer<typeof NewTicketSchema>;

export const NewTicketSchema = zod.object({
  ticketType: zod.string().min(1, { message: 'Type is required!' }),
  status: zod.string().min(1, { message: 'Status is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }),
});

export function TicketDetailView({ ticket }) {
  const { data, isLoading, isError, error } = useGetReplyMutation(ticket?._id);
  const { mutateAsync, isPending } = useAddReplyMutation();

  console.log(data);

  const defaultValues = useMemo(
    () => ({
      ticketType: ticket?.ticketType || '',
      status: ticket?.status || '',
      message: '',
    }),
    []
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewTicketSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      mutateAsync({ data }).then((res) => {
        reset();
      });
    } catch (error) {
      console.error(error);
    }
  });

  const detailForm = (
    <div>
      <CardHeader title="Reply To Ticket" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.SingelSelect
            checkbox
            name="ticketType"
            label="Ticket Type"
            options={TICKET_TYPE_OPTIONS}
          />
          <Field.SingelSelect
            checkbox
            name="status"
            label="Status"
            options={TICKET_STATUS_OPTIONS}
          />
        </Box>
        <Field.Text name="message" required label="Reply about Ticket" multiline rows={4} />
      </Stack>
    </div>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading="Tickets"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ticket List', href: paths.dashboard.tickets.allList },
          { name: 'Ticket' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="p-5">
        <div className="flex justify-between gap-4 pb-5">
          <div className="flex gap-4">
            <div
              className={`w-[1.5rem] h-[1.5rem] rounded-full ${ticket.status === 'Created' ? 'bg-[#F8A534]' : ticket.status === 'Dispatched' ? 'bg-[#3B8AFF]' : ticket.status === 'Technical Finish' ? 'bg-[#8E33FF]' : ticket.status === 'In progress' ? 'bg-[#FFAB00]' : 'bg-[#54C104]'}`}
            ></div>
            <h2 className="text-[16px] text-black font-bold">{ticket?.ticketId}</h2>
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-[#FFAB00] w-[.6em] h-[.6em] rounded-full"></div>
            <p className="text-[#84818A] text-[16px] font-semibold">{ticket?.ticketType}</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="bg-[#FFAB00] w-[.6em] h-[.6em] rounded-full"></div>
            <p className="text-[#84818A] text-[16px] font-semibold">{ticket?.status}</p>
          </div>
          <div>
            <p className="text-[#84818A] text-[14px] font-semibold">
              Posted at - {fDate(ticket?.createdAt)}
            </p>
          </div>
        </div>
        <h2 className="text-black text-[16px] font-bold">{ticket?.subject}</h2>
        <p className="text-[#84818A] text-[14px] font-semibold">
          <strong>Issue:</strong> {ticket?.message}
        </p>

        <Form methods={methods} onSubmit={onSubmit}>
          {data &&
            data.length > 0 &&
            data.map((reply, index) => (
              <Card className="px-4 py-2 mt-4 ml-6">
                <span className="text-gray-400 text-[13px]">
                  {reply?.userType === 'user' ? 'Reply from User' : 'Reply from Admin'}
                </span>
                <p className="text-[#575658] font-semibold flex justify-between">
                  <span>{reply?.message}</span>
                  <span className="text-[#84818A] text-[12px] font-semibold">
                    Replied At - {fDate(reply?.createdAt)} {fTime(reply?.createdAt)}
                  </span>
                </p>
              </Card>
            ))}
          <Stack spacing={5}>
            {detailForm}
            <div className="flex flex-row justify-end gap-3">
              <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                {isPending ? 'Submitting...' : 'Submit Reply'}
              </button>
            </div>
          </Stack>
        </Form>
      </Card>
    </>
  );
}
