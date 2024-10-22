import { Box, Card, CardHeader, Stack } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { Field, Form } from 'src/components/hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TICKET_TYPE_OPTIONS, TICKET_STATUS_OPTIONS } from 'src/_mock';
import { fDate } from 'src/utils/format-time';
import useAddReplyMutation from './http/useAddReplyMutation';

export type NewPostSchemaType = zod.infer<typeof NewTicketSchema>;

export const NewTicketSchema = zod.object({
  ticketType: zod.string().min(1, { message: 'Type is required!' }),
  status: zod.string().min(1, { message: 'Status is required!' }),
  message: zod.string(),
});

export function TicketDetailView({ ticket }) {
  const { mutateAsync, isPending } = useAddReplyMutation();
  const defaultValues = useMemo(
    () => ({
      ticketType: '',
      status: '',
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

  const datailForm = (
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
        <Field.Text name="message" label="Reply about Ticket" multiline rows={4} />
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
            <span
              className={`w-[1.5rem] h-[1.5rem] rounded-full ${ticket.status === 'Created' ? 'bg-[#F8A534]' : ticket.status === 'Dispatched' ? 'bg-[#3B8AFF]' : ticket.status === 'Technical Finish' ? 'bg-[#8E33FF]' : ticket.status === 'In progress' ? 'bg-[#FFAB00]' : 'bg-[#54C104]'}`}
            ></span>
            <h2 className="text-[16px] text-black font-bold">{ticket.ticketId}</h2>
          </div>
          <p className="text-[#84818A] text-[14px] font-semibold">
            Posted at - {fDate(ticket.createdAt)}
          </p>
        </div>
        <h2 className="text-black text-[16px] font-bold">{ticket.subject}</h2>
        <p className="text-[#84818A] text-[14px] pt-2 whitespace-wrap">{ticket.message}</p>

        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={5}>
            {datailForm}
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
