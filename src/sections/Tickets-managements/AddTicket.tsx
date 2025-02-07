import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  CardHeader,
  CircularProgress,
  Divider,
  InputAdornment,
  Link,
  ListItemText,
  TableCell,
  TableRow,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { useDebounce } from 'src/routes/hooks/use-debounce';
import { paths } from 'src/routes/paths';
import { imgUrl } from 'src/utils/BaseUrls';
import { z as zod } from 'zod';
import { useGetUserByIdMutation } from '../Artistlist/http/userGetUserByIdMutation';
import { RenderAllPicklists } from '../Picklists/RenderAllPicklist';
import useAddTicketMutation from './http/useAddTicketMutation';

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

export function AddTicket() {
  const [search, setSearch] = useState('');
  const [id, setId] = useState('');
  const { mutate, isPending } = useAddTicketMutation();

  const picklist = RenderAllPicklists([
    'Ticket Status',
    'Ticket Urgency',
    'Ticket Priority',
    'Ticket Impact',
    'Ticket Type',
  ]);

  const picklistMap = picklist.reduce((acc, item: any) => {
    acc[item?.fieldName] = item?.picklist;
    return acc;
  }, {});

  const status = picklistMap['Ticket Status'];
  const urgency = picklistMap['Ticket Urgency'];
  const priority = picklistMap['Ticket Priority'];
  const impact = picklistMap['Ticket Impact'];
  const ticketType = picklistMap['Ticket Type'];

  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      userId: '',
      artistName: '',
      ticketType: '',
      subject: '',
      message: '',
      urgency: '',
      impact: '',
      priority: '',
      status: '',
      id: '',
      ticketImg: null,
    }),
    []
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, reset } = methods;
  const values = watch();

  const debounceUserInput = useDebounce(search, 800);
  const { data: artistData, isLoading: artistLoading } = useGetUserByIdMutation(debounceUserInput);

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
    setSearch('');
  };

  const handleRemoveImg = () => {
    setValue('ticketImg', null);
  };

  const removeText = () => {
    reset({
      userId: '',
      artistName: '',
    });
    setSearch('');
  };

  const renderDetails = (
    <Card>
      <CardHeader title="Ticket Details" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 2 }}>
        <Field.Text
          name="userId"
          required
          label="Requested By"
          placeholder="Search User By Name, Email or UserId"
          InputLabelProps={{ shrink: true }}
          value={search ? search : methods.getValues('userId') ? methods.getValues('userId') : ''}
          onChange={(e) => {
            setSearch(e.target.value);
            if (methods.getValues('userId')) methods.setValue('userId', '');
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  onClick={removeText}
                  component="span"
                  sx={{ color: 'text.disabled', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  X
                </Box>
              </InputAdornment>
            ),
          }}
        />
        {search !== '' && (
          <div className="absolute top-[9rem] w-[95.5%] rounded-lg z-10 h-[30vh] bottom-[14vh] border-[1px] border-zinc-700 backdrop-blur-sm overflow-auto ">
            <TableRow sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {artistLoading ? (
                <TableCell>
                  <CircularProgress size={30} />
                </TableCell>
              ) : artistData && artistData?.length > 0 ? (
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
                      <Avatar alt={i?.artistName} src={`${imgUrl}/users/${i?.mainImage}`} />

                      <ListItemText
                        disableTypography
                        primary={
                          <Typography variant="body2" noWrap>
                            {name(i)} ({i?.userId})
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
        <Field.Text disabled required name="artistName" label="Name" />
        <Field.SingelSelect
          required
          name="ticketType"
          label="Ticket Type"
          options={ticketType ? ticketType : []}
        />
        <Field.SingelSelect required name="status" label="Status" options={status ? status : []} />

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
            options={urgency ? urgency : []}
          />
          <Field.SingelSelect
            options={impact ? impact : []}
            required
            name="impact"
            label="Impact"
          />
          <Field.SingelSelect
            required
            name="priority"
            label="Priority"
            options={priority ? priority : []}
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
    <>
      <CustomBreadcrumbs
        heading="Add Ticket"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add Ticket' }]}
        sx={{ mb: 3 }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-2">
              {renderDetails}
              <div className="flex-row justify-end gap-3 mt-8 hidden md:flex">
                <span
                  onClick={() => navigate(paths.dashboard.tickets.allList)}
                  className="bg-white text-black border py-2 px-3 rounded-md cursor-pointer"
                >
                  Cancel
                </span>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  {isPending ? 'Adding...' : 'Add Ticket'}
                </button>
              </div>
            </div>
            <div className="col-span-1">
              {renderImage}{' '}
              <div className="flex flex-row justify-end gap-3 mt-8 md:hidden">
                <span
                  onClick={() => navigate(paths.dashboard.tickets.allList)}
                  className="bg-white text-black border py-2 px-3 rounded-md cursor-pointer"
                >
                  Cancel
                </span>
                <button type="submit" className="bg-black text-white py-2 px-3 rounded-md">
                  {isPending ? 'Adding...' : 'Add Ticket'}
                </button>
              </div>
            </div>
          </div>
        </Stack>
      </Form>
    </>
  );
}
