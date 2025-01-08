import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Card, CardHeader, MenuItem, MenuList, Stack } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fDate, fTime } from 'src/utils/format-time';
import { z as zod } from 'zod';
import { RenderAllPicklists } from '../Picklists/RenderAllPicklist';
import useAddReplyMutation from './http/useAddReplyMutation';
import { useGetTicketDetailMutation } from './http/useGetTicketDetailMutation';
import { useGetTicketReply } from './http/useGetTicketReply';
import { Divider } from '@mui/material';
import { imgUrl } from 'src/utils/BaseUrls';

export type NewPostSchemaType = zod.infer<typeof NewTicketSchema>;

export const NewTicketSchema = zod.object({
  email: zod.string().optional(),
  ticketType: zod.string().min(1, { message: 'Type is required!' }),
  status: zod.string().min(1, { message: 'Status is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }),
  ticketImg: zod.any().optional(),
});

export function TicketDetailView() {
  const id = useSearchParams().get('id');
  const { data, isLoading } = useGetTicketDetailMutation(id);
  const { data: reply, isLoading: replyLoading } = useGetTicketReply(id);
  const { mutateAsync, isPending } = useAddReplyMutation();

  const picklist = RenderAllPicklists(['Ticket Status', 'Ticket Type']);

  const picklistMap = picklist.reduce((acc, item: any) => {
    acc[item?.fieldName] = item?.picklist;
    return acc;
  }, {});

  const status = picklistMap['Ticket Status'];
  const ticketType = picklistMap['Ticket Type'];

  const popover = usePopover();
  const defaultValues = useMemo(
    () => ({
      email: data?.user?.email || '',
      ticketType: data?.ticketType || '',
      status: data?.status || '',
      ticketImg: null,
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
        ticketImg: null,
        message: '',
      });
    }
  }, [data, reset]);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      methods.setValue('ticketImg', file);
    }
  };

  const handleRemoveDocument = () => {
    methods.setValue(`ticketImg`, null);
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
          alignItems={'center'}
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text required name="email" label="Customer Email" disabled />
          <Field.SingelSelect
            name="ticketType"
            label="Ticket Type"
            options={ticketType ? ticketType : []}
          />
          <Field.SingelSelect
            required
            name="status"
            label="Status"
            options={status ? status : []}
          />
          {methods.watch('ticketImg') && methods.getValues('ticketImg') ? (
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FileThumbnail
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  window.open(URL.createObjectURL(methods.getValues('ticketImg')), '_blank')
                }
                file={methods.getValues('ticketImg')?.name}
              />

              <span
                onClick={handleRemoveDocument}
                className="ml-[3rem] text-[14px] absolute bg-red-100 text-red-500 rounded-md px-2 py-1 cursor-pointer"
              >
                Remove Document
              </span>
            </Box>
          ) : (
            <>
              <input
                className="border border-gray-200 rounded-md px-2 py-3 hover:border-gray-600"
                required
                type="file"
                accept="file/*"
                onChange={(e) => handleFileChange(e)}
              />
            </>
          )}
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
          { name: `Ticket Detail - ${data?.ticketId}` },
        ]}
        sx={{ mb: 3 }}
      />
      <Card sx={{ p: 2, border: '1px solid #E0E0E0' }}>
        <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
          <div className="flex gap-4">
            <span
              className={`w-[1.5rem] h-[1.5rem] rounded-full ${data?.status === 'Created' ? 'bg-[#F8A534]' : data?.status === 'Dispatched' ? 'bg-[#3B8AFF]' : data?.status === 'Technical Finish' ? 'bg-[#8E33FF]' : data?.status === 'In progress' ? 'bg-[#FFAB00]' : 'bg-[#54C104]'}`}
            ></span>
            <h2 className="text-[16px] text-black font-bold">{data?.ticketId}</h2>
            <span
              onClick={popover.onOpen}
              className="bg-green-600 text-white rounded-sm px-1 pr-2 flex items-center cursor-pointer"
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
                  Urgency - {data?.urgency}
                </MenuItem>
                <MenuItem>
                  <Iconify icon="flat-color-icons:high-priority" />
                  Priority - {data?.priority}
                </MenuItem>
                <MenuItem>
                  <Iconify icon="game-icons:gooey-impact" />
                  Impact - {data?.impact}
                </MenuItem>
                <MenuItem>
                  <Iconify icon="gridicons:status" />
                  Status - {data?.status}
                </MenuItem>
              </MenuList>
            </CustomPopover>
          </div>

          <span className="text-[14px] flex items-center gap-3">
            <span>{fDate(data?.createdAt)}</span> {fTime(data?.createdAt)}
          </span>
        </Stack>
        <Stack spacing={1}>
          <h2 className="text-black text-[18px] font-bold">{data?.subject}</h2>
          <p className="text-[#84818A]">{data?.message}</p>
          {data?.ticketImg && (
            <span className="flex bg-slate-100 p-2 rounded-md items-center gap-2">
              <p className="text-[#3d3d3d]">View Attachment</p> -
              {data?.ticketImg.includes('.pdf') || data?.ticketImg.includes('.docx') ? (
                <FileThumbnail
                  sx={{ cursor: 'pointer' }}
                  onClick={() => window.open(`${imgUrl}/documents/${data?.ticketImg}`, '_blank')}
                  file={data?.ticketImg}
                />
              ) : (
                <FileThumbnail
                  sx={{ cursor: 'pointer' }}
                  onClick={() => window.open(`${imgUrl}/users/${data?.ticketImg}`, '_blank')}
                  file={data?.ticketImg}
                />
              )}
            </span>
          )}
        </Stack>
        <Box className="p-5">
          <div className="max-h-[60vh] overflow-y-scroll">
            {replyLoading ? (
              <LoadingScreen />
            ) : (
              reply &&
              reply.length > 0 &&
              reply.map((reply, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 mt-2 border border-gray-200 rounded-md cursor-pointer ${reply?.userType !== 'user' ? 'bg-zinc-100' : null} hover:bg-zinc-100`}
                >
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Box display={'flex'} alignItems={'center'} gap={0.5}>
                      <Iconify icon="mingcute:user-4-line" width={24} height={24} />
                      <span>
                        {reply?.userType === 'user' ? (
                          <>
                            {`${name(data?.user)} wrote `}
                            <span className="text-[#858585]">({data?.user?.email})</span> :
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
                  {reply.ticketImg && (
                    <span className="flex bg-slate-100 ml-7 py-2 rounded-md items-center gap-2">
                      <p className="text-[#3d3d3d]">View Attachment</p> -
                      {reply.ticketImg.includes('.pdf') || reply.ticketImg.includes('.docx') ? (
                        <FileThumbnail
                          sx={{ cursor: 'pointer' }}
                          onClick={() =>
                            window.open(`${imgUrl}/documents/${reply.ticketImg}`, '_blank')
                          }
                          file={reply.ticketImg}
                        />
                      ) : (
                        <FileThumbnail
                          sx={{ cursor: 'pointer' }}
                          onClick={() =>
                            window.open(`${imgUrl}/users/${reply.ticketImg}`, '_blank')
                          }
                          file={reply.ticketImg}
                        />
                      )}
                    </span>
                  )}
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
      {data?.ticketFeedback ? (
        <Card sx={{ border: '1px solid #E0E0E0', mt: 2 }}>
          <CardHeader title="User Feedback" sx={{ mb: 2 }} />
          <Divider />
          <Stack spacing={1} p={2} direction={'column'}>
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
          </Stack>
        </Card>
      ) : null}
    </>
  );
}
