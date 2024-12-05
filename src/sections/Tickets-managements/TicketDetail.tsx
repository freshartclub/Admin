import { Box, Card, CardHeader, MenuList, Stack } from '@mui/material';
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
import { Iconify } from 'src/components/iconify';
import { MenuItem } from '@mui/material';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { FileThumbnail } from 'src/components/file-thumbnail';

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

  const popover = usePopover();
  const defaultValues = useMemo(
    () => ({
      email: data?.data?.user?.email || '',
      ticketType: data?.data?.ticketType || '',
      status: data?.data?.status || '',
      message: '',
    }),
    [data?.data]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewTicketSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (data?.data) {
      reset({
        email: data?.data?.user?.email || '',
        ticketType: data?.data?.ticketType || '',
        status: data?.data?.status || '',
        message: '',
      });
    }
  }, [data?.data, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync({ data }).then(() => {
        reset();
      });
    } catch (error) {
      console.error(error);
    }
  });

  const name = (val) => {
    let fullName = val?.artistName || '';

    if (val?.artistSurname1) fullName += ' ' + val?.artistSurname1;
    if (val?.artistSurname2) fullName += ' ' + val?.artistSurname2;

    return fullName.trim();
  };

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
          { name: `Ticket Detail - ${data?.data?.ticketId}` },
        ]}
        sx={{ mb: 3 }}
      />
      <Card sx={{ p: 2, border: '1px solid #E0E0E0' }}>
        <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
          <div className="flex gap-4">
            <span
              className={`w-[1.5rem] h-[1.5rem] rounded-full ${data?.data?.status === 'Created' ? 'bg-[#F8A534]' : data?.data?.status === 'Dispatched' ? 'bg-[#3B8AFF]' : data?.data?.status === 'Technical Finish' ? 'bg-[#8E33FF]' : data?.data?.status === 'In progress' ? 'bg-[#FFAB00]' : 'bg-[#54C104]'}`}
            ></span>
            <h2 className="text-[16px] text-black font-bold">{data?.data?.ticketId}</h2>
            <span
              onClick={popover.onOpen}
              className="bg-green-500 text-white rounded-sm px-1 pr-2 flex items-center cursor-pointer"
            >
              <Iconify icon="si:unfold-more-duotone" /> See More
            </span>
            <CustomPopover
              open={popover.open}
              anchorEl={popover.anchorEl}
              onClose={popover.onClose}
              slotProps={{ arrow: { placement: 'left-top' } }}
            >
              <MenuList>
                <MenuItem>
                  <Iconify icon="tabler:urgent" />
                  Urgency - {data?.data?.urgency}
                </MenuItem>
                <MenuItem>
                  <Iconify icon="flat-color-icons:high-priority" />
                  Priority - {data?.data?.priority}
                </MenuItem>
                <MenuItem>
                  <Iconify icon="game-icons:gooey-impact" />
                  Impact - {data?.data?.impact}
                </MenuItem>
                <MenuItem>
                  <Iconify icon="gridicons:status" />
                  Status - {data?.data?.status}
                </MenuItem>
              </MenuList>
            </CustomPopover>
          </div>

          <span className="text-[14px] flex items-center gap-3">
            <span>{fDate(data?.data?.createdAt)}</span> {fTime(data?.data?.createdAt)}
          </span>
        </Stack>
        <Stack spacing={1}>
          <h2 className="text-black text-[18px] font-bold">{data?.data?.subject}</h2>
          <p className="text-[#84818A]">{data?.data?.message}</p>
          {data?.data?.ticketImg && (
            <span className="flex bg-slate-100 p-2 rounded-md items-center gap-2">
              <p className="text-[#3d3d3d]">View Attached File</p> -
              {data?.data?.ticketImg.includes('.pdf') || data?.data?.ticketImg.includes('.docx') ? (
                <FileThumbnail
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    window.open(`${data?.url}/documents/${data?.data?.ticketImg}`, '_blank')
                  }
                  file={data?.data?.ticketImg}
                />
              ) : (
                <FileThumbnail
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    window.open(`${data?.url}/users/${data?.data?.ticketImg}`, '_blank')
                  }
                  file={data?.data?.ticketImg}
                />
              )}
            </span>
          )}
        </Stack>
        <Box className="p-5">
          <div className="max-h-[50vh] overflow-y-scroll">
            {replyLoading ? (
              <LoadingScreen />
            ) : (
              reply &&
              reply.length > 0 &&
              reply.map((reply, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 mt-2 rounded-sm cursor-pointer ${reply?.userType !== 'user' ? 'bg-zinc-100' : null} hover:bg-zinc-100`}
                >
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Box display={'flex'} alignItems={'center'} gap={0.5}>
                      <Iconify icon="mingcute:user-4-line" width={24} height={24} />
                      <span>
                        {reply?.userType === 'user' ? (
                          <>
                            {`${name(data?.data?.user)} wrote `}
                            <span className="text-[#858585]">({data?.data?.user?.email})</span> :
                          </>
                        ) : (
                          <>
                            {`Admin wrote `}
                            <span className="text-[#858585]">(Admin)</span> :
                          </>
                        )}
                      </span>
                    </Box>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      className="text-[14px]"
                    >
                      <span>{fDate(reply?.createdAt)}</span> {fTime(reply?.createdAt)}
                    </Box>
                  </Stack>
                  <Box className="ml-7 py-2">{reply?.message}</Box>
                </div>
              ))
            )}
          </div>
          <Form methods={methods} onSubmit={onSubmit}>
            <Stack>
              {detailForm}
              <div className="flex flex-row justify-end gap-3">
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  {isPending ? 'Submitting...' : 'Submit Reply'}
                </button>
              </div>
            </Stack>
          </Form>
        </Box>
      </Card>
    </>
  );
}
