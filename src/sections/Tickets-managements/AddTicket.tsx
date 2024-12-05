import type { IPostItem } from 'src/types/blog';

import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, CardHeader, Link, ListItemText, TableCell, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  INC_IMPACT_OPTIONS,
  INC_PRIORITY_OPTIONS,
  INC_URGENCY_OPTIONS,
  TICKET_STATUS_OPTIONS,
  TICKET_TYPE_OPTIONS,
} from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';
import useAddTicketMutation from './http/useAddTicketMutation';
import { useGetUesrByQueryInput } from './http/useGetUserMutation';
import { useNavigate } from 'react-router';
import { Divider } from '@mui/material';

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
  impact: zod.string().min(1, { message: 'Impact is required!' }),
  ticketImg: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
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
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      userId: currentPost?.userId || '',
      artistName: currentPost?.artistName || '',
      ticketType: currentPost?.ticketType || '',
      subject: currentPost?.subject || '',
      message: currentPost?.message || '',
      urgency: currentPost?.urgency || '',
      impact: currentPost?.impact || '',
      priority: currentPost?.priority || '',
      status: currentPost?.status || '',
      id: currentPost?._id || '',
      ticketImg: currentPost?.ticketImg || null,
    }),
    [currentPost]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit } = methods;
  const values = watch();

  const debounceUserInput = useDebounce(methods.getValues('userId'), 1000);
  const { refetch, data: artistData } = useGetUesrByQueryInput(debounceUserInput);

  useEffect(() => {
    if (methods.getValues('userId') !== '') {
      refetch();
    }
  }, [debounceUserInput]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.id = id;

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      await mutate(formData);
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

  const refillData = (artistData) => {
    setValue('userId', artistData?.userId);
    setId(artistData?._id);
    setValue('artistName', name(artistData));
    setOpen(false);
  };

  const handleRemoveImg = () => {
    setValue('ticketImg', null);
  };

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 2 }}>
        <Field.Text
          name="userId"
          required
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
                            {name(i)} - {i?.userId}
                          </Typography>
                        }
                        secondary={
                          <Link noWrap variant="body2" sx={{ color: 'text.disabled' }}>
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
        <Field.Text required name="artistName" label="Name" />
        <Field.SingelSelect
          checkbox
          required
          name="ticketType"
          label="Ticket Type"
          options={TICKET_TYPE_OPTIONS}
        />
        <Field.SingelSelect
          required
          checkbox
          name="status"
          label="Status"
          options={TICKET_STATUS_OPTIONS}
        />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.SingelSelect
            required
            name="urgency"
            label="Urgency"
            options={INC_URGENCY_OPTIONS}
          />
          <Field.SingelSelect required name="impact" label="Impact" options={INC_IMPACT_OPTIONS} />
          <Field.SingelSelect
            required
            name="priority"
            label="Priority"
            options={INC_PRIORITY_OPTIONS}
          />
        </Box>

        <Field.Text name="subject" required label="Ticket Title" />
        <Field.Text name="message" required label="Type your message/issue" multiline rows={4} />
      </Stack>
    </Card>
  );

  const renderImage = (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Add File (Image/Document) *" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Upload
          accept="image/*"
          name="ticketImg"
          maxSize={3145728}
          onDelete={handleRemoveImg}
        />
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
        <Stack spacing={3}>
          <div className="grid grid-cols-3  gap-3">
            <div className="col-span-1">{renderImage}</div>
            <div className="col-span-2">
              {renderDetails}
              <div className="flex flex-row justify-end gap-3 mt-8">
                <span
                  onClick={() => navigate(paths.dashboard.tickets.allList)}
                  className="bg-white text-black border py-2 px-3 cursor-pointer rounded-md"
                >
                  Cancel
                </span>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  {isPending ? 'Saving...' : 'Add Ticket'}
                </button>
              </div>
            </div>
          </div>
        </Stack>
      </Form>
    </div>
  );
}
