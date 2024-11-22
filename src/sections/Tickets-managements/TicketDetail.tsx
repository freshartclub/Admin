import { Box, Card, CardHeader, Stack } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { Field, Form } from 'src/components/hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TICKET_TYPE_OPTIONS, TICKET_STATUS_OPTIONS } from 'src/_mock';
import { fDate, fTime } from 'src/utils/format-time';
import useAddReplyMutation from './http/useAddReplyMutation';
import { useGetTicketDetailMutation } from './http/useGetTicketDetailMutation';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { useGetTicketReply } from './http/useGetTicketReply';

export type NewPostSchemaType = zod.infer<typeof NewTicketSchema>;

export const NewTicketSchema = zod.object({
  email: zod.string().optional(),
  ticketType: zod.string().min(1, { message: 'Type is required!' }),
  status: zod.string().min(1, { message: 'Status is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }),
});

export function TicketDetailView() {
  const id = useSearchParams().get('id');
  const { data, isLoading } = useGetTicketDetailMutation(id);
  const { data: reply, isLoading: replyLoading } = useGetTicketReply(id);
  const { mutateAsync, isPending } = useAddReplyMutation();

  const defaultValues = useMemo(
    () => ({
      email: data?.user?.email || '',
      ticketType: data?.ticketType || '',
      status: data?.status || '',
      message: '',
    }),
    [data]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewTicketSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (data) {
      reset({
        email: data?.user?.email || '',
        ticketType: data?.ticketType || '',
        status: data?.status || '',
        message: '',
      });
    }
  }, [data, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync({ data });
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  if (isLoading) return <LoadingScreen />;

  const detailForm = (
    <>
      <CardHeader title="Reply To Ticket" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="email" label="Customer Email" disabled />
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
    </>
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
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
        <div className="flex gap-4">
          <span
            className={`w-[1.5rem] h-[1.5rem] rounded-full ${data?.status === 'Created' ? 'bg-[#F8A534]' : data?.status === 'Dispatched' ? 'bg-[#3B8AFF]' : data?.status === 'Technical Finish' ? 'bg-[#8E33FF]' : data?.status === 'In progress' ? 'bg-[#FFAB00]' : 'bg-[#54C104]'}`}
          ></span>
          <h2 className="text-[16px] text-black font-bold">{data?.ticketId}</h2>
        </div>

        <span className="text-[#84818A] text-[14px]">Posted at - {fDate(data?.createdAt)}</span>
      </Stack>
      <Stack spacing={1}>
        <h2 className="text-black text-[18px] font-bold">{data?.subject}</h2>
        <p className="text-[#84818A]">{data?.message}</p>
      </Stack>
      <Card className="p-5">
        <Form methods={methods} onSubmit={onSubmit}>
          {replyLoading ? (
            <LoadingScreen />
          ) : (
            reply &&
            reply.length > 0 &&
            reply.map((reply, index) => (
              <Card key={index} className="px-4 py-2 mt-4 ml-6">
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
            ))
          )}
          <Stack>
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
