import type { IPostItem } from 'src/types/blog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import {
  INC_GROUP_OPTIONS,
  INC_PRIORITY_OPTIONS,
  INC_SEVERITY_OPTIONS,
  INC_STATUS_OPTIONS,
  INC_TYPE_OPTIONS,
  INC_URGENCY_OPTIONS,
  TICKET_STATUS_OPTIONS,
  TICKET_TYPE_OPTIONS,
} from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import useAddIncidentMutation from './http/useAddIncidentMutation';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { useGetUesrByQueryInput } from './http/useGetUserMutation';
import useAddTicketMutation from './http/useAddTicketMutation';
import { Avatar, TableCell } from '@mui/material';
import { TableRow } from '@mui/material';
import { ListItemText } from '@mui/material';
import { Link } from '@mui/material';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  userId: zod.string().min(1, { message: 'Requested By is required!' }),
  artistName: zod.string().min(1, { message: 'Name is required!' }),
  ticketType: zod.string().min(1, { message: 'Ticket Type is required!' }),
  subject: zod.string().min(1, { message: 'Subject is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }),
  urgency: zod.string().min(1, { message: 'Urgency is required!' }),
  priority: zod.string().min(1, { message: 'Priority is required!' }),
  status: zod.string().min(1, { message: 'Status is required!' }),
  id: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function AddTicket({ currentPost }: Props) {
  const [open, setOpen] = useState(true);
  const [id, setId] = useState('');
  const { mutate, isPending } = useAddTicketMutation();

  const defaultValues = useMemo(
    () => ({
      userId: currentPost?.userId || '',
      artistName: currentPost?.artistName || '',
      ticketType: currentPost?.ticketType || '',
      subject: currentPost?.subject || '',
      message: currentPost?.message || '',
      urgency: currentPost?.urgency || '',
      priority: currentPost?.priority || '',
      status: currentPost?.status || '',
      id: currentPost?._id || '',
    }),
    [currentPost]
  );

  const methods = useForm<NewPostSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const debounceUserInput = useDebounce(methods.getValues('userId'), 500);

  const {
    refetch,
    data: artistData,
    isPending: isArtistIdPending,
  } = useGetUesrByQueryInput(debounceUserInput);

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  useEffect(() => {
    if (methods.getValues('userId') !== '') {
      refetch();
    }
  }, [debounceUserInput]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.id = id;
      await mutate(data);
    } catch (error) {
      console.error(error);
    }
  });

  const refillData = (artistData) => {
    setValue('userId', artistData?.userId);
    setId(artistData?._id);
    setValue('artistName', artistData?.artistName);
    setOpen(false);
  };

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 2 }}>
        <Field.Text
          name="userId"
          label="Requested By"
          placeholder="Search User By Name, Email or UserId"
        />
        {methods.getValues('userId') && open && (
          <div className="absolute top-20 w-[95.5%] rounded-lg z-10 h-[30vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto ">
            <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {artistData && artistData.length > 0 ? (
                artistData.map((i, j) => (
                  <TableCell
                    onClick={() => refillData(i)}
                    key={j}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Avatar alt={i?.artistName}>{i?.avatar}</Avatar>

                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="body2" noWrap>
                            {i?.artistName} - {i?.userId}
                          </Typography>
                        }
                        secondary={
                          <Link
                            noWrap
                            variant="body2"
                            // onClick={onViewRow}
                            sx={{ color: 'text.disabled' }}
                          >
                            {i?.email}
                          </Link>
                        }
                      />
                    </Stack>
                  </TableCell>
                ))
              ) : (
                <TableCell>No Data Available</TableCell>
              )}
            </TableRow>
          </div>
        )}
        <Field.Text name="artistName" label="Name" />
        <Field.SingelSelect
          checkbox
          name="ticketType"
          label="Ticket Type"
          options={TICKET_TYPE_OPTIONS}
        />
        <Field.SingelSelect checkbox name="status" label="Status" options={TICKET_STATUS_OPTIONS} />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.SingelSelect name="urgency" label="Urgency" options={INC_URGENCY_OPTIONS} />
          <Field.SingelSelect name="priority" label="Priority" options={INC_PRIORITY_OPTIONS} />
        </Box>

        <Field.Text name="subject" label="Ticket Title" />
        <Field.Text name="message" label="Type your message/issue" multiline rows={4} />
      </Stack>
    </Card>
  );

  return (
    <div>
      <CustomBreadcrumbs
        heading="Add Ticket"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add Ticket' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              {renderDetails}
              <div className="flex flex-row justify-start gap-3 mt-8">
                <button type="button" className="bg-white text-black border py-2 px-3 rounded-md">
                  Cancel
                </button>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  {isPending ? 'Saving...' : 'Add Ticket'}
                </button>
              </div>
            </div>

            <div className="col-span-1"></div>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
